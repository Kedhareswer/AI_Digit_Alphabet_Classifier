import React, { useRef, useEffect, useState } from 'react';

interface DrawingCanvasProps {
  onDrawingChange: (imageData: ImageData) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawingChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const brushSize = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Emit initial empty canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    onDrawingChange(imageData);
  }, [onDrawingChange]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.lineTo(currentX, currentY);
    ctx.stroke();
    
    setLastX(currentX);
    setLastY(currentY);

    // Emit drawing change
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    onDrawingChange(imageData);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Emit cleared canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    onDrawingChange(imageData);
  };

  return (
    <div className="border border-gray-300 p-6">
      <div className="text-sm font-medium text-black mb-3">Draw</div>
      <div className="flex flex-col items-center space-y-4">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="border border-gray-300 bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <button
          onClick={clearCanvas}
          className="px-6 py-2 text-sm bg-white text-black border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;