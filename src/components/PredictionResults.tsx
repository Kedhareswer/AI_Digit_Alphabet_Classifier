import React from 'react';
import { Hash, Type, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Prediction {
  label: string;
  confidence: number;
}

interface PredictionResultsProps {
  digitPredictions: Prediction[];
  letterPredictions: Prediction[];
  selectedType: 'digit' | 'alphabet';
  isLoading: boolean;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ digitPredictions, letterPredictions, selectedType, isLoading }) => {

  const currentPredictions = selectedType === 'digit' ? digitPredictions : letterPredictions;
  const topPrediction = currentPredictions.length > 0 ? currentPredictions[0] : null;

  return (
    <div className="border border-gray-300 p-6">
      <div className="text-sm font-medium text-black mb-3">Results</div>
      
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-sm">Analyzing...</div>
        </div>
      ) : currentPredictions.length > 0 ? (
        <div className="space-y-6">
          {/* Top Prediction */}
          {topPrediction && (
            <div className="text-center p-6 border border-gray-300">
              <div className="text-6xl font-bold text-black mb-3">
                {topPrediction.label}
              </div>
              <div className="text-sm text-gray-600">
                {(topPrediction.confidence * 100).toFixed(1)}%
              </div>
            </div>
          )}

          {/* Other Predictions */}
          {currentPredictions.length > 1 && (
            <div>
              <div className="text-xs text-gray-600 mb-3">Others:</div>
              <div className="space-y-2">
                {currentPredictions.slice(1, 4).map((prediction) => (
                  <div
                    key={prediction.label}
                    className="flex items-center justify-between py-2 px-3 border border-gray-200"
                  >
                    <span className="text-xl font-medium text-black">
                      {prediction.label}
                    </span>
                    <span className="text-xs text-gray-600">
                      {(prediction.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="text-sm">Draw to predict</div>
        </div>
      )}
    </div>
  );
};

export default PredictionResults;