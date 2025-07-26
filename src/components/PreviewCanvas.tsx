import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PreviewCanvasProps {
  imageData: ImageData | null;
}

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({ imageData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (imageData) {
      // Draw the processed image
      ctx.putImageData(imageData, 0, 0);
    }
  }, [imageData]);

  return (
      <div className="flex flex-col items-center">
      <div className="text-sm font-medium text-black mb-2">Preview</div>
      <canvas
        ref={canvasRef}
        width={28}
        height={28}
        className="border border-gray-300 bg-white mx-auto block"
        style={{
            width: '100px', 
            height: '100px',
          imageRendering: 'pixelated'
        }}
      />
        <div className="mt-3 text-xs text-gray-500">28×28</div>
      <div className="mt-1 text-center text-xs text-gray-500">28×28</div>
    </div>
  );
};

export default PreviewCanvas;