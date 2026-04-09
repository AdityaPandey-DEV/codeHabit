import { Metadata } from "next";
import QuizView from "./QuizView";

export const metadata: Metadata = {
  title: "CS Mastery Quizzes",
  description: "Test your computer science knowledge with structured quizzes on Full Stack, DBMS, and OS.",
};

export default function QuizPage() {
  return <QuizView />;
}
