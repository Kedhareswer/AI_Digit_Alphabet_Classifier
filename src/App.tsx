import React, { useState, useCallback, useEffect } from 'react';
import { Brain, Zap, Sparkles } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import { motion } from 'framer-motion';
import TypeSelector from './components/TypeSelector';
import DrawingCanvas from './components/DrawingCanvas';
import PreviewCanvas from './components/PreviewCanvas';
import PredictionResults from './components/PredictionResults';
import { preprocessImage, imageDataToTensor } from './utils/imageProcessing';
import { 
  createDigitModel, 
  createLetterModel, 
  generateDigitTrainingData, 
  generateLetterTrainingData,
  predict 
} from './utils/modelUtils';

interface Prediction {
  label: string;
  confidence: number;
}

function App() {
  const [currentImageData, setCurrentImageData] = useState<ImageData | null>(null);
  const [processedImageData, setProcessedImageData] = useState<ImageData | null>(null);
  const [selectedType, setSelectedType] = useState<'digit' | 'alphabet'>('digit');
  const [digitPredictions, setDigitPredictions] = useState<Prediction[]>([]);
  const [letterPredictions, setLetterPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [digitModel, setDigitModel] = useState<tf.LayersModel | null>(null);
  const [letterModel, setLetterModel] = useState<tf.LayersModel | null>(null);
  const [isTraining, setIsTraining] = useState(false);

  // Initialize and train models
  useEffect(() => {
    const initializeModels = async () => {
      setIsTraining(true);
      
      try {
        // Create models
        const dModel = createDigitModel();
        const lModel = createLetterModel();

        // Generate training data
        const digitData = generateDigitTrainingData();
        const letterData = generateLetterTrainingData();

        // Train digit model
        await dModel.fit(digitData.features, digitData.labels, {
          epochs: 5,
          batchSize: 32,
          verbose: 0
        });

        // Train letter model
        await lModel.fit(letterData.features, letterData.labels, {
          epochs: 5,
          batchSize: 32,
          verbose: 0
        });

        setDigitModel(dModel);
        setLetterModel(lModel);

        // Clean up training data
        digitData.features.dispose();
        digitData.labels.dispose();
        letterData.features.dispose();
        letterData.labels.dispose();
      } catch (error) {
        console.error('Error training models:', error);
      } finally {
        setIsTraining(false);
      }
    };

    initializeModels();
  }, []);

  const handleDrawingChange = useCallback((imageData: ImageData) => {
    setCurrentImageData(imageData);
    
    // Process the image for preview
    const processed = preprocessImage(imageData, 'single');
    setProcessedImageData(processed);
  }, []);

  const handlePredict = async () => {
    if (!processedImageData || !digitModel || !letterModel || isTraining) return;

    setIsLoading(true);

    try {
      // Convert processed image to tensor
      const tensorData = imageDataToTensor(processedImageData);

      if (selectedType === 'digit') {
        // Get digit predictions
        const digitProbs = await predict(digitModel, tensorData);
        const digitLabels = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const digitResults = digitProbs
          .map((prob, index) => ({ label: digitLabels[index], confidence: prob }))
          .sort((a, b) => b.confidence - a.confidence);
        setDigitPredictions(digitResults);
        setLetterPredictions([]);
      } else {
        // Get letter predictions
        const letterProbs = await predict(letterModel, tensorData);
        const letterLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const letterResults = letterProbs
          .map((prob, index) => ({ label: letterLabels[index], confidence: prob }))
          .sort((a, b) => b.confidence - a.confidence);
        setLetterPredictions(letterResults);
        setDigitPredictions([]);
      }
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTypeChange = (type: 'digit' | 'alphabet') => {
    setSelectedType(type);
    setDigitPredictions([]);
    setLetterPredictions([]);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-black mb-2">AI Classifier</h1>
          <div className="inline-block bg-gray-50 border border-gray-300 px-4 py-2 text-sm text-gray-700 mb-4">
            <strong>Note:</strong> Draw a digit (0-9) or letter (A-Z) in the canvas. The AI will analyze your drawing and predict what character you wrote.
          </div>
          {isTraining && (
            <div className="text-sm text-gray-600">Initializing...</div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-4">
            <TypeSelector
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
            />
            <div className="border border-gray-300 p-4">
            <PreviewCanvas 
              imageData={processedImageData} 
            />
          </div>
          </div>

          {/* Drawing */}
          <div className="space-y-4">
            <DrawingCanvas onDrawingChange={handleDrawingChange} />
            <div className="text-center">
              <button
                onClick={handlePredict}
                disabled={!processedImageData || isLoading || isTraining}
                className="px-8 py-3 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors text-sm font-medium"
              >
                {isLoading ? 'Analyzing...' : `Predict ${selectedType === 'digit' ? 'Digit' : 'Letter'}`}
              </button>
            </div>
          </div>

          {/* Results */}
          <div>
            <PredictionResults
              digitPredictions={digitPredictions}
              letterPredictions={letterPredictions}
              selectedType={selectedType}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;