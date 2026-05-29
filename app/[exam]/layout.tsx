import React from "react";

interface ExamLayoutProps {
  children: React.ReactNode;
}

export default function ExamLayout({ children }: ExamLayoutProps) {
  return <div className="w-full min-h-screen flex flex-col">{children}</div>;
}
