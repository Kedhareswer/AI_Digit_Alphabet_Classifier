import * as tf from '@tensorflow/tfjs';

// Simple digit classification model
export const createDigitModel = () => {
  const model = tf.sequential({
    layers: [
      tf.layers.reshape({ inputShape: [784], targetShape: [28, 28, 1] }),
      tf.layers.conv2d({
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
        inputShape: [28, 28, 1]
      }),
      tf.layers.maxPooling2d({ poolSize: 2 }),
      tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }),
      tf.layers.maxPooling2d({ poolSize: 2 }),
      tf.layers.flatten(),
      tf.layers.dense({ units: 128, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 10, activation: 'softmax' })
    ]
  });

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  return model;
};

// Simple letter classification model
export const createLetterModel = () => {
  const model = tf.sequential({
    layers: [
      tf.layers.reshape({ inputShape: [784], targetShape: [28, 28, 1] }),
      tf.layers.conv2d({
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
        inputShape: [28, 28, 1]
      }),
      tf.layers.maxPooling2d({ poolSize: 2 }),
      tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }),
      tf.layers.maxPooling2d({ poolSize: 2 }),
      tf.layers.flatten(),
      tf.layers.dense({ units: 128, activation: 'relu' }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ units: 26, activation: 'softmax' })
    ]
  });

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  return model;
};

// Generate synthetic training data for digits
export const generateDigitTrainingData = () => {
  const numSamples = 1000;
  const features = [];
  const labels = [];

  for (let i = 0; i < numSamples; i++) {
    const digit = Math.floor(Math.random() * 10);
    const image = generateDigitImage(digit);
    features.push(image);
    
    const label = new Array(10).fill(0);
    label[digit] = 1;
    labels.push(label);
  }

  return {
    features: tf.tensor2d(features),
    labels: tf.tensor2d(labels)
  };
};

// Generate synthetic training data for letters
export const generateLetterTrainingData = () => {
  const numSamples = 1000;
  const features = [];
  const labels = [];

  for (let i = 0; i < numSamples; i++) {
    const letter = Math.floor(Math.random() * 26);
    const image = generateLetterImage(letter);
    features.push(image);
    
    const label = new Array(26).fill(0);
    label[letter] = 1;
    labels.push(label);
  }

  return {
    features: tf.tensor2d(features),
    labels: tf.tensor2d(labels)
  };
};

// Simple pattern-based digit generation
const generateDigitImage = (digit: number): number[] => {
  const image = new Array(784).fill(0);
  
  // Basic patterns for each digit (simplified)
  const patterns = {
    0: () => drawOval(image),
    1: () => drawVerticalLine(image),
    2: () => drawCurvedTwo(image),
    3: () => drawCurvedThree(image),
    4: () => drawFour(image),
    5: () => drawFive(image),
    6: () => drawSix(image),
    7: () => drawSeven(image),
    8: () => drawEight(image),
    9: () => drawNine(image)
  };

  patterns[digit as keyof typeof patterns]();
  
  // Add noise
  for (let i = 0; i < image.length; i++) {
    if (Math.random() < 0.1) {
      image[i] = Math.random() * 0.3;
    }
  }

  return image;
};

// Simple pattern-based letter generation
const generateLetterImage = (letterIndex: number): number[] => {
  const image = new Array(784).fill(0);
  
  // Basic patterns for letters A-Z (simplified)
  switch (letterIndex) {
    case 0: drawA(image); break; // A
    case 1: drawB(image); break; // B
    case 2: drawC(image); break; // C
    // ... add more letters as needed
    default: drawRandomLetter(image, letterIndex); break;
  }
  
  // Add noise
  for (let i = 0; i < image.length; i++) {
    if (Math.random() < 0.1) {
      image[i] = Math.random() * 0.3;
    }
  }

  return image;
};

// Helper functions for drawing patterns
const setPixel = (image: number[], x: number, y: number, value: number = 1) => {
  if (x >= 0 && x < 28 && y >= 0 && y < 28) {
    image[y * 28 + x] = value;
  }
};

const drawOval = (image: number[]) => {
  for (let y = 4; y < 24; y++) {
    for (let x = 6; x < 22; x++) {
      const dx = x - 14;
      const dy = y - 14;
      if (dx * dx / 64 + dy * dy / 100 < 1 && dx * dx / 36 + dy * dy / 81 > 1) {
        setPixel(image, x, y);
      }
    }
  }
};

const drawVerticalLine = (image: number[]) => {
  for (let y = 4; y < 24; y++) {
    setPixel(image, 13, y);
    setPixel(image, 14, y);
    setPixel(image, 15, y);
  }
};

const drawCurvedTwo = (image: number[]) => {
  // Top horizontal line
  for (let x = 6; x < 22; x++) {
    setPixel(image, x, 4);
    setPixel(image, x, 5);
  }
  // Diagonal
  for (let i = 0; i < 15; i++) {
    setPixel(image, 20 - i, 6 + i);
  }
  // Bottom horizontal line
  for (let x = 6; x < 22; x++) {
    setPixel(image, x, 22);
    setPixel(image, x, 23);
  }
};

const drawCurvedThree = (image: number[]) => {
  // Top and bottom curves
  for (let x = 6; x < 20; x++) {
    setPixel(image, x, 4);
    setPixel(image, x, 13);
    setPixel(image, x, 23);
  }
  for (let y = 5; y < 13; y++) {
    setPixel(image, 19, y);
  }
  for (let y = 14; y < 23; y++) {
    setPixel(image, 19, y);
  }
};

const drawFour = (image: number[]) => {
  // Vertical line
  for (let y = 4; y < 15; y++) {
    setPixel(image, 8, y);
  }
  // Horizontal line
  for (let x = 8; x < 20; x++) {
    setPixel(image, x, 14);
  }
  // Right vertical line
  for (let y = 4; y < 24; y++) {
    setPixel(image, 19, y);
  }
};

const drawFive = (image: number[]) => {
  // Top horizontal
  for (let x = 6; x < 20; x++) {
    setPixel(image, x, 4);
  }
  // Left vertical (top half)
  for (let y = 4; y < 14; y++) {
    setPixel(image, 6, y);
  }
  // Middle horizontal
  for (let x = 6; x < 18; x++) {
    setPixel(image, x, 14);
  }
  // Right vertical (bottom half)
  for (let y = 14; y < 23; y++) {
    setPixel(image, 18, y);
  }
  // Bottom horizontal
  for (let x = 6; x < 18; x++) {
    setPixel(image, x, 23);
  }
};

const drawSix = (image: number[]) => {
  // Similar to 5 but with bottom loop
  drawFive(image);
  for (let y = 14; y < 23; y++) {
    setPixel(image, 6, y);
  }
};

const drawSeven = (image: number[]) => {
  // Top horizontal
  for (let x = 6; x < 22; x++) {
    setPixel(image, x, 4);
  }
  // Diagonal line
  for (let i = 0; i < 19; i++) {
    setPixel(image, 21 - i * 0.8, 5 + i);
  }
};

const drawEight = (image: number[]) => {
  drawOval(image);
  // Add middle section
  for (let x = 8; x < 20; x++) {
    setPixel(image, x, 13);
    setPixel(image, x, 14);
    setPixel(image, x, 15);
  }
};

const drawNine = (image: number[]) => {
  // Top loop
  for (let y = 4; y < 15; y++) {
    for (let x = 6; x < 22; x++) {
      const dx = x - 14;
      const dy = y - 9;
      if (dx * dx / 64 + dy * dy / 25 < 1 && dx * dx / 36 + dy * dy / 16 > 1) {
        setPixel(image, x, y);
      }
    }
  }
  // Right vertical line
  for (let y = 9; y < 24; y++) {
    setPixel(image, 20, y);
  }
};

const drawA = (image: number[]) => {
  // Left diagonal
  for (let i = 0; i < 20; i++) {
    setPixel(image, 6 + i * 0.4, 23 - i);
  }
  // Right diagonal
  for (let i = 0; i < 20; i++) {
    setPixel(image, 22 - i * 0.4, 23 - i);
  }
  // Horizontal bar
  for (let x = 10; x < 18; x++) {
    setPixel(image, x, 15);
  }
};

const drawB = (image: number[]) => {
  // Left vertical
  for (let y = 4; y < 24; y++) {
    setPixel(image, 6, y);
  }
  // Top horizontal
  for (let x = 6; x < 18; x++) {
    setPixel(image, x, 4);
  }
  // Middle horizontal
  for (let x = 6; x < 16; x++) {
    setPixel(image, x, 14);
  }
  // Bottom horizontal
  for (let x = 6; x < 18; x++) {
    setPixel(image, x, 23);
  }
  // Right curves
  for (let y = 5; y < 14; y++) {
    setPixel(image, 17, y);
  }
  for (let y = 14; y < 23; y++) {
    setPixel(image, 17, y);
  }
};

const drawC = (image: number[]) => {
  // Left vertical
  for (let y = 6; y < 22; y++) {
    setPixel(image, 8, y);
  }
  // Top horizontal
  for (let x = 8; x < 20; x++) {
    setPixel(image, x, 6);
  }
  // Bottom horizontal
  for (let x = 8; x < 20; x++) {
    setPixel(image, x, 22);
  }
};

const drawRandomLetter = (image: number[], letterIndex: number) => {
  // Generate a simple pattern based on the letter index
  const seed = letterIndex;
  for (let y = 4; y < 24; y++) {
    for (let x = 6; x < 22; x++) {
      if ((x + y + seed) % 7 === 0) {
        setPixel(image, x, y, 0.8);
      }
    }
  }
};

export const predict = async (model: tf.LayersModel, imageData: Float32Array) => {
  const tensor = tf.tensor2d([Array.from(imageData)]);
  const prediction = model.predict(tensor) as tf.Tensor;
  const probabilities = await prediction.data();
  
  tensor.dispose();
  prediction.dispose();
  
  return Array.from(probabilities);
};