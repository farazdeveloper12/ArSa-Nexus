import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './Header';
import Header from './Header';
import Footer from './Footer';

const MainLayoutContent = ({ children, title = "Arsa Nexus", description = "Leading AI Education Platform" }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="relative">
        {children}
      </main>

      <Footer />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            border: '1px solid var(--toast-border)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      <style jsx global>{`
        :root {
          --toast-bg: #ffffff;
          --toast-color: #374151;
          --toast-border: #e5e7eb;
        }
        
        .dark {
          --toast-bg: #374151;
          --toast-color: #f9fafb;
          --toast-border: #4b5563;
        }
      `}</style>
    </div>
  );
};

const MainLayout = ({ children, ...props }) => {
  return (
    <ThemeProvider>
      <MainLayoutContent {...props}>
        {children}
      </MainLayoutContent>
    </ThemeProvider>
  );
};

export default MainLayout;
