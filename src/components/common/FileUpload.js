import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { formatFileSize } from '../../utils/formatters';

const FileUpload = ({ onFilesSelected, maxFiles = 5, acceptedFileTypes = 'image/*' }) => {
  const [files, setFiles] = React.useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    
    const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles.map(f => f.file));
  }, [files, maxFiles, onFilesSelected]);

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles.map(f => f.file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: acceptedFileTypes,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`image-upload ${isDragActive ? 'border-accent-pink bg-accent-pink bg-opacity-10' : ''}`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-2" />
        {isDragActive ? (
          <p className="text-accent-pink">Drop the files here...</p>
        ) : (
          <>
            <p className="text-gray-600">Drag & drop files here, or click to select</p>
            <p className="text-sm text-gray-400 mt-1">
              Max {maxFiles} files (Images only, up to 5MB each)
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="image-preview">
          {files.map((file, index) => (
            <div key={index} className="image-preview-item">
              {file.file.type.startsWith('image/') ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-24 object-cover"
                />
              ) : (
                <div className="w-full h-24 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-500">{file.name}</span>
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="image-preview-remove"
              >
                <FaTimes size={12} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {file.name} ({formatFileSize(file.size)})
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;