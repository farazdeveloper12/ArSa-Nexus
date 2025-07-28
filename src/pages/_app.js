import '@/app/globals.css';
import { AnimatePresence } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SmoothScrollProvider } from '../contexts/SmoothScrollContext';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <SmoothScrollProvider>
          <AuthProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '500',
                  maxWidth: '500px',
                },
                success: {
                  style: {
                    background: '#10B981',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                  },
                },
              }}
            />
            <AnimatePresence mode="wait" initial={false}>
              {getLayout(<Component {...pageProps} />)}
            </AnimatePresence>
          </AuthProvider>
        </SmoothScrollProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
