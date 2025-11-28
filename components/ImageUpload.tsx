import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  image: string | null;
  onImageChange: (base64: string | null) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, image, onImageChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-400">{label}</span>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all duration-300 ${
          image ? 'border-primary bg-surface' : 'border-border hover:border-gray-500 hover:bg-zinc-800'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
        
        {image ? (
          <>
            <img src={image} alt="Preview" className="h-full w-full object-contain rounded-lg p-1" />
            <button 
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/70 hover:bg-red-500/80 text-white p-1 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <Upload size={32} className="mb-2" />
            <span className="text-xs">Click to upload</span>
          </div>
        )}
      </div>
    </div>
  );
};
