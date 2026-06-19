import type { Metadata } from "next";
import { TutorClient } from "./TutorClient";
import { ErrorBoundary } from "@/shared/components/feedback/ErrorBoundary";

export const metadata: Metadata = { title: "AI Tutor" };

export default function TutorPage() {
  return (
    <div className="h-full flex flex-col max-w-7xl mx-auto">
      <ErrorBoundary>
        <TutorClient />
      </ErrorBoundary>
    </div>
  );
}
