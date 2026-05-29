import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { exams } from "../../../lib/config/exams";
import { predictRank } from "../../../lib/queries/predict-rank";

// Dynamic route configuration
export const dynamic = "force-dynamic";

// Zod Schema for validation
const predictSchema = z.object({
  exam: z.string().min(1, "Exam identifier is required")
    .refine((val) => exams.some((e) => e.slug === val), {
      message: "Invalid exam selected. Must be one of: " + exams.map(e => e.slug).join(", "),
    }),
  marks: z.number().positive("Marks must be a positive number greater than zero"),
  category: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod parse validation
    const result = predictSchema.safeParse(body);
    
    if (!result.success) {
      const formattedErrors = result.error.issues.map(err => ({
        field: err.path.join("."),
        message: err.message
      }));
      
      return NextResponse.json(
        { 
          success: false, 
          errors: formattedErrors,
          message: result.error.issues[0]?.message || "Validation failed"
        },
        { status: 400 }
      );
    }

    const { exam, marks, category, gender } = result.data;
    
    // Find exam details to validate max marks
    const examConfig = exams.find((e) => e.slug === exam)!;
    if (marks > examConfig.maxMarks) {
      return NextResponse.json(
        {
          success: false,
          errors: [{ field: "marks", message: `Marks cannot exceed the maximum value of ${examConfig.maxMarks} for ${examConfig.name}` }],
          message: `Marks cannot exceed the maximum value of ${examConfig.maxMarks}`
        },
        { status: 400 }
      );
    }

    // 2. Perform interpolation prediction
    const prediction = await predictRank({
      exam,
      marks,
      category: category || null,
      gender: gender || null,
    });

    return NextResponse.json({
      success: true,
      ...prediction
    });
  } catch (error: any) {
    console.error("API Prediction error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "An unexpected error occurred during prediction." 
      },
      { status: 500 }
    );
  }
}
