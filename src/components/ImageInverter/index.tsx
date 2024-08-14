'use client'

import React, { useState, useRef } from 'react';
import { Facebook, Twitter, Linkedin, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ImageInverter: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [invertedImage, setInvertedImage] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        setOriginalImage(event.target?.result as string);
        setInvertedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const invertImage = () => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
      }
      ctx.putImageData(imageData, 0, 0);
      setInvertedImage(canvas.toDataURL('image/png'));
    };
    img.src = originalImage;
  };

  const downloadImage = () => {
    if (!invertedImage) return;

    const link = document.createElement('a');
    link.href = invertedImage;
    link.download = 'inverted-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-2">Invert image (colors)</h1>
      <p className="text-center mb-6 text-gray-600">Free online tool</p>
      
      <div className="flex justify-center space-x-4 mb-8">
        <Button variant="outline" size="icon" className="rounded-full"><Facebook size={20} /></Button>
        <Button variant="outline" size="icon" className="rounded-full"><Twitter size={20} /></Button>
        <Button variant="outline" size="icon" className="rounded-full">P</Button>
        <Button variant="outline" size="icon" className="rounded-full"><Linkedin size={20} /></Button>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Original Image</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center"
            >
              <Upload size={16} className="mr-2" />
              UPLOAD IMAGE
            </Button>
          </div>
          <div 
            className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {originalImage ? (
              <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <Upload size={48} className="mb-2" />
                <span>Click to upload an image</span>
              </div>
            )}
            {isHovering && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white">Click to upload a new photo</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Inverted Image</h3>
          <div className="w-full h-64 border-2 border-gray-200 rounded-lg flex items-center justify-center">
            {invertedImage ? (
              <img src={invertedImage} alt="Inverted" className="max-w-full max-h-full object-contain" />
            ) : (
              <span className="text-gray-400">No inverted image yet</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={invertImage} disabled={!originalImage} className="bg-blue-500 hover:bg-blue-600 text-white">
          INVERT IMAGE
        </Button>
        <Button onClick={downloadImage} disabled={!invertedImage} variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-50">
          DOWNLOAD IMAGE
        </Button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ImageInverter;