"use client";

import React, { useState } from "react";
import { RankPredictorForm } from "./RankPredictorForm";
import { ResultCard } from "./ResultCard";

interface HomePredictorWrapperProps {
  initialExamSlug?: string;
}

export const HomePredictorWrapper: React.FC<HomePredictorWrapperProps> = ({
  initialExamSlug,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<any | null>(null);

  const handlePredict = async (formData: {
    exam: string;
    marks: number;
    category?: string | null;
    gender?: string | null;
  }) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        setPrediction(result);
      } else {
        alert(result.message || "Failed to calculate prediction. Please check your inputs.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong connecting to the prediction server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
  };

  return (
    <div className="w-full transition-all duration-300">
      {prediction ? (
        <ResultCard
          predictedRank={prediction.predictedRank}
          rankRange={prediction.rankRange}
          confidence={prediction.confidence}
          dataPointsUsed={prediction.dataPointsUsed}
          onReset={handleReset}
        />
      ) : (
        <RankPredictorForm
          onPredict={handlePredict}
          isLoading={isLoading}
          initialExamSlug={initialExamSlug}
        />
      )}
    </div>
  );
};
