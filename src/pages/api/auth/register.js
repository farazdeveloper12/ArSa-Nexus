import { hash } from 'bcryptjs';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    await dbConnect();
    
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const hashedPassword = await hash(password, 12);
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role for new users
      createdAt: new Date(),
    });
    
    // Return success, but don't send password
    const { password: _, ...userWithoutPassword } = user._doc;
    
    return res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}