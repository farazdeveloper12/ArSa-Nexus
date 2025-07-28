import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const uploadDirs = [
    'public/uploads',
    'public/uploads/users',
    'public/uploads/training',
    'public/uploads/products',
    'public/uploads/announcements',
    'public/uploads/content',
    'public/uploads/blog',
    'public/uploads/temp'
  ];

  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

const validateFile = (file) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];

  // Max file size (5MB)
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG files are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 5MB.');
  }

  return true;
};

const generateFileName = (originalName, category) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  return `${category}_${timestamp}_${random}${extension}`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Check authentication
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    // Ensure upload directories exist
    ensureUploadDirs();

    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5, // Allow multiple files
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    const category = fields.category?.[0] || 'general';
    const uploadedFiles = [];

    // Handle multiple files
    const fileArray = Array.isArray(files.file) ? files.file : [files.file].filter(Boolean);

    for (const file of fileArray) {
      try {
        // Validate file
        validateFile(file);

        // Generate unique filename
        const fileName = generateFileName(file.originalFilename, category);
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', category, fileName);

        // Ensure category directory exists
        const categoryDir = path.dirname(uploadPath);
        if (!fs.existsSync(categoryDir)) {
          fs.mkdirSync(categoryDir, { recursive: true });
        }

        // Move file to upload directory
        fs.copyFileSync(file.filepath, uploadPath);

        // Clean up temp file
        fs.unlinkSync(file.filepath);

        const fileUrl = `/uploads/${category}/${fileName}`;

        uploadedFiles.push({
          originalName: file.originalFilename,
          fileName: fileName,
          url: fileUrl,
          size: file.size,
          type: file.mimetype,
          category: category
        });

      } catch (fileError) {
        console.error('Error processing file:', fileError);
        // Continue with other files if one fails
        uploadedFiles.push({
          error: fileError.message,
          originalName: file.originalFilename
        });
      }
    }

    // Log successful uploads
    const successfulUploads = uploadedFiles.filter(file => !file.error);
    console.log(`✅ Successfully uploaded ${successfulUploads.length} files:`,
      successfulUploads.map(f => f.url));

    return res.status(200).json({
      success: true,
      message: `Successfully uploaded ${successfulUploads.length} file(s)`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'File upload failed'
    });
  }
} 