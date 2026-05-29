"use client";

import React, { useState, useEffect } from "react";
import { exams, Exam } from "../lib/config/exams";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/Input";
import { Sparkles, Trophy, Award, BarChart2 } from "lucide-react";

interface RankPredictorFormProps {
  onPredict: (data: {
    exam: string;
    marks: number;
    category?: string | null;
    gender?: string | null;
  }) => void;
  isLoading?: boolean;
  initialExamSlug?: string;
}

export const RankPredictorForm: React.FC<RankPredictorFormProps> = ({
  onPredict,
  isLoading = false,
  initialExamSlug = "",
}) => {
  const defaultExam = exams.find((e) => e.slug === initialExamSlug) || exams[0];

  const [selectedExam, setSelectedExam] = useState<Exam>(defaultExam);
  const [marks, setMarks] = useState<string>("");
  const [category, setCategory] = useState<string>("ALL");
  const [gender, setGender] = useState<string>("ALL");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset/sync exam when props change
  useEffect(() => {
    if (initialExamSlug) {
      const exam = exams.find((e) => e.slug === initialExamSlug);
      if (exam) {
        setSelectedExam(exam);
      }
    }
  }, [initialExamSlug]);

  // Handle exam change
  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value;
    const exam = exams.find((ex) => ex.slug === slug);
    if (exam) {
      setSelectedExam(exam);
      setCategory("ALL");
      setGender("ALL");
      setMarks("");
      setErrors({});
    }
  };

  // Form validation
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!marks) {
      newErrors.marks = "Please enter your marks";
    } else {
      const mVal = Number(marks);
      if (isNaN(mVal)) {
        newErrors.marks = "Marks must be a number";
      } else if (mVal <= 0) {
        newErrors.marks = "Marks must be greater than 0";
      } else if (mVal > selectedExam.maxMarks) {
        newErrors.marks = `Marks cannot exceed ${selectedExam.maxMarks} for ${selectedExam.name}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onPredict({
      exam: selectedExam.slug,
      marks: Number(marks),
      category: category === "ALL" ? null : category,
      gender: gender === "ALL" ? null : gender,
    });
  };

  // Dynamic placeholders based on exam
  const getMarksPlaceholder = () => {
    if (selectedExam.slug === "jee-main") return "e.g. 195 (out of 300)";
    if (selectedExam.slug === "neet") return "e.g. 625 (out of 720)";
    if (selectedExam.slug === "gate") return "e.g. 68.5 (out of 100)";
    return `e.g. ${Math.round(selectedExam.maxMarks * 0.65)} (out of ${selectedExam.maxMarks})`;
  };

  // Prepare select options
  const examOptions = exams.map((e) => ({ value: e.slug, label: e.name }));
  
  const categoryOptions = [
    { value: "ALL", label: "GENERAL (CRL) or No Category" },
    ...selectedExam.categories.map((c) => ({ value: c, label: c })),
  ];

  const genderOptions = [
    { value: "ALL", label: "Select Gender (Optional)" },
    ...selectedExam.genders.map((g) => ({ value: g, label: g })),
  ];

  return (
    <Card className="w-full relative overflow-hidden p-8 sm:p-10">
      {/* Decorative top badge */}
      <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 font-extrabold px-6 py-2 rounded-bl-3xl text-sm flex items-center gap-2 dark:bg-indigo-950 dark:text-indigo-400">
        <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
        Fun & Accurate
      </div>

      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-zinc-50 tracking-tight flex items-center gap-3 mb-6">
        <Trophy className="w-8 h-8 text-amber-500" />
        Rank Predictor
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Exam Selector */}
        <Select
          id="exam-select"
          label="1. Choose Competitive Exam"
          options={examOptions}
          value={selectedExam.slug}
          onChange={handleExamChange}
        />

        {/* Marks Input */}
        <Input
          id="marks-input"
          label={`2. Enter Your Score (Max: ${selectedExam.maxMarks})`}
          placeholder={getMarksPlaceholder()}
          type="number"
          step="any"
          value={marks}
          onChange={(e) => setMarks(e.target.value)}
          error={errors.marks}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Dropdown */}
          <Select
            id="category-select"
            label="3. Category (Optional)"
            options={categoryOptions}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* Gender Dropdown */}
          <Select
            id="gender-select"
            label="4. Gender (Optional)"
            options={genderOptions}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
          className="mt-4 flex gap-2 items-center text-lg"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Calculating Rank...
            </>
          ) : (
            <>
              <Award className="w-5 h-5" />
              Predict My Rank!
            </>
          )}
        </Button>
      </form>

      {/* Trust factors */}
      <div className="mt-6 flex flex-wrap justify-between items-center text-xs font-bold text-slate-400 dark:text-zinc-500 gap-2 border-t border-slate-100 pt-4 dark:border-zinc-900">
        <span className="flex items-center gap-1">
          <BarChart2 className="w-4 h-4 text-emerald-500" />
          No Signup Required
        </span>
        <span>•</span>
        <span>100% Free & Open Access</span>
        <span>•</span>
        <span>Includes 2023–2025 data</span>
      </div>
    </Card>
  );
};
