export const preprocessImage = (imageData: ImageData): ImageData => {
  const canvas = document.createElement('canvas');
  canvas.width = 28;
  canvas.height = 28;
  const ctx = canvas.getContext('2d')!;

  // Create a temporary canvas to work with the original image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempCtx = tempCanvas.getContext('2d')!;
  tempCtx.putImageData(imageData, 0, 0);

  // Find bounding box of drawn content
  const { left, top, right, bottom } = findBoundingBox(imageData);
  
  if (left === -1) {
    // Empty canvas - return blank 28x28
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  // Calculate dimensions and centering
  const contentWidth = right - left + 1;
  const contentHeight = bottom - top + 1;
  const maxDim = Math.max(contentWidth, contentHeight);
  
  // Add padding
  const paddedSize = Math.min(maxDim * 1.2, Math.min(imageData.width, imageData.height));
  
  // Center the content in a square
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  
  const sourceX = Math.max(0, centerX - paddedSize / 2);
  const sourceY = Math.max(0, centerY - paddedSize / 2);
  const sourceWidth = Math.min(paddedSize, imageData.width - sourceX);
  const sourceHeight = Math.min(paddedSize, imageData.height - sourceY);

  // Fill with white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the cropped and scaled content
  ctx.drawImage(
    tempCanvas,
    sourceX, sourceY, sourceWidth, sourceHeight,
    0, 0, canvas.width, canvas.height
  );

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const findBoundingBox = (imageData: ImageData) => {
  const { data, width, height } = imageData;
  let left = -1, top = -1, right = -1, bottom = -1;

  // Find top
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      if (data[index] < 255) { // Not white
        top = y;
        break;
      }
    }
    if (top !== -1) break;
  }

  if (top === -1) return { left: -1, top: -1, right: -1, bottom: -1 };

  // Find bottom
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      if (data[index] < 255) {
        bottom = y;
        break;
      }
    }
    if (bottom !== -1) break;
  }

  // Find left
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = (y * width + x) * 4;
      if (data[index] < 255) {
        left = x;
        break;
      }
    }
    if (left !== -1) break;
  }

  // Find right
  for (let x = width - 1; x >= 0; x--) {
    for (let y = 0; y < height; y++) {
      const index = (y * width + x) * 4;
      if (data[index] < 255) {
        right = x;
        break;
      }
    }
    if (right !== -1) break;
  }

  return { left, top, right, bottom };
};

export const imageDataToTensor = (imageData: ImageData) => {
  const { data } = imageData;
  const pixelCount = imageData.width * imageData.height;
  const tensor = new Float32Array(pixelCount);
  
  for (let i = 0; i < pixelCount; i++) {
    // Convert to grayscale and normalize to [0, 1]
    const pixelIndex = i * 4;
    const grayscale = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
    tensor[i] = (255 - grayscale) / 255; // Invert: black = 1, white = 0
  }
  
  return tensor;
};