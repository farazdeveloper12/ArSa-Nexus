import Head from 'next/head';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';

const BlogPage = () => {
  return (
    <>
      <Head>
        <title>Blog | Arsa Nexus LLC</title>
        <meta name="description" content="Read our latest articles and insights about technology education and training." />
      </Head>

      <div className="pt-20 min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Blog</h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Stay updated with our latest articles, insights, and news about technology education and training programs.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-2xl mx-auto">
              <svg className="h-16 w-16 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-600">
                Our blog is currently under development. We'll be sharing valuable content about technology education, training tips, and industry insights very soon.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

BlogPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default BlogPage; 