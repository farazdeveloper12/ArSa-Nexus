// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { compare } from 'bcryptjs';

export const authOptions = {
  providers: [
    // Google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Credentials provider
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          console.log('🔍 Login attempt for:', credentials.email);

          await dbConnect();

          // Find user with case-insensitive email search
          const user = await User.findOne({
            email: { $regex: new RegExp(`^${credentials.email}$`, 'i') }
          });

          if (!user) {
            console.log('❌ User not found:', credentials.email);

            // List all users for debugging
            const allUsers = await User.find({}, 'email role active');
            console.log('📋 Available users:', allUsers.map(u => ({ email: u.email, role: u.role, active: u.active })));

            throw new Error('No user found with this email');
          }

          console.log('✅ User found:', {
            id: user._id,
            email: user.email,
            role: user.role,
            active: user.active
          });

          // Check if user is active - treat undefined as true
          const isActive = user.active !== false; // undefined or true = active, only false = inactive
          if (!isActive) {
            console.log('❌ User account is inactive');
            throw new Error('Account is inactive');
          }

          console.log('✅ User account is active');

          // Verify password
          const isPasswordValid = await compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.log('❌ Invalid password for user:', user.email);
            throw new Error('Invalid password');
          }

          console.log('✅ Password verified successfully');

          // Update last login
          await User.updateOne(
            { _id: user._id },
            { lastLogin: new Date() }
          );

          // Return user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            active: isActive
          };

        } catch (error) {
          console.error('🚫 Authentication error:', error.message);
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        console.log('🔐 SignIn callback - User:', user.email, 'Provider:', account.provider);

        // Handle Google OAuth
        if (account.provider === 'google') {
          await dbConnect();

          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user from Google
            await User.create({
              name: user.name,
              email: user.email,
              role: 'user',
              provider: 'google',
              active: true
            });
            console.log('✅ New Google user created:', user.email);
          } else {
            console.log('✅ Existing Google user found:', user.email);
          }
        }

        return true;
      } catch (error) {
        console.error('❌ SignIn callback error:', error);
        return false;
      }
    },

    async jwt({ token, user }) {
      // Add user info to token on login
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.active = user.active;
        console.log('📝 JWT token created for:', user.email, 'Role:', user.role);
      }
      return token;
    },

    async session({ session, token }) {
      // Add user info to session
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.active = token.active;
        console.log('🎫 Session created for:', session.user.email, 'Role:', session.user.role);
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-development',
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.arsanexus.com' : undefined,
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.arsanexus.com' : undefined,
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.arsanexus.com' : undefined,
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  debug: false
};

export default NextAuth(authOptions);
