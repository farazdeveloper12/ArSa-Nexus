import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const FileUpload = ({
  onUpload,
  category = 'general',
  multiple = false,
  existingFiles = [],
  className = '',
  label = 'Upload Images',
  accept = 'image/*',
  maxSize = 5 // MB
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState(existingFiles);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    const maxSizeBytes = maxSize * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      throw new Error(`File size must be less than ${maxSize}MB`);
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPEG, PNG, GIF, WebP, and SVG files are allowed');
    }

    return true;
  };

  const handleFiles = useCallback(async (fileList) => {
    const validFiles = [];
    const errors = [];

    // Validate files
    for (const file of fileList) {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`);
      }
    }

    // Show validation errors
    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error, { duration: 4000 });
      });
    }

    if (validFiles.length === 0) {
      return;
    }

    // Upload files
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append('file', file);
      });
      formData.append('category', category);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.success) {
        const successfulFiles = result.files.filter(file => !file.error);
        const newFiles = multiple ? [...files, ...successfulFiles] : successfulFiles;

        setFiles(newFiles);
        onUpload(multiple ? newFiles : successfulFiles[0]);

        toast.success(`Successfully uploaded ${successfulFiles.length} file(s)!`, {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#ffffff',
          },
        });

        // Show errors for failed uploads
        const failedFiles = result.files.filter(file => file.error);
        failedFiles.forEach(file => {
          toast.error(`${file.originalName}: ${file.error}`, { duration: 4000 });
        });

      } else {
        throw new Error(result.message || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`, { duration: 4000 });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [files, multiple, onUpload, category, maxSize]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFiles(droppedFiles);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      handleFiles(selectedFiles);
    }
    // Reset input value to allow re-uploading same file
    e.target.value = '';
  }, [handleFiles]);

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onUpload(multiple ? newFiles : null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>

      {/* Upload Area */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver
            ? 'border-purple-400 bg-purple-500/10'
            : 'border-white/20 bg-white/5 hover:border-purple-400 hover:bg-white/10'
          }
          ${uploading ? 'pointer-events-none opacity-75' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="text-white">Uploading...</p>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="text-sm text-gray-400">{uploadProgress}%</p>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              animate={{
                y: isDragOver ? -5 : 0,
                scale: isDragOver ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            </motion.div>

            <div>
              <p className="text-lg font-medium text-white">
                Drop your images here, or <span className="text-purple-400">browse</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supports: JPEG, PNG, GIF, WebP, SVG (Max {maxSize}MB)
              </p>
              {multiple && (
                <p className="text-xs text-gray-500 mt-1">
                  You can upload multiple files
                </p>
              )}
            </div>
          </div>
        )}

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-purple-500/20 border-2 border-purple-400 rounded-xl flex items-center justify-center"
            >
              <div className="text-center">
                <CloudArrowUpIcon className="mx-auto h-16 w-16 text-purple-400" />
                <p className="text-lg font-medium text-purple-300 mt-2">
                  Drop files to upload
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-300">
            {multiple ? 'Uploaded Files:' : 'Uploaded File:'}
          </h4>

          <div className={`grid gap-3 ${multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="relative group bg-white/10 rounded-lg p-3 border border-white/20"
                >
                  {file.error ? (
                    <div className="flex items-center space-x-2">
                      <ExclamationTriangleIcon className="h-8 w-8 text-red-400 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{file.originalName}</p>
                        <p className="text-xs text-red-400">{file.error}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Image Preview */}
                      <div className="aspect-square bg-white/5 rounded-lg mb-2 overflow-hidden">
                        {file.url ? (
                          <img
                            src={file.url}
                            alt={file.originalName || file.fileName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                          <PhotoIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="space-y-1">
                        <p className="text-xs text-white truncate">
                          {file.originalName || file.fileName}
                        </p>
                        {file.size && (
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>

                      {/* Success indicator */}
                      <div className="absolute top-1 right-1">
                        <CheckCircleIcon className="h-4 w-4 text-green-400" />
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                        className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 