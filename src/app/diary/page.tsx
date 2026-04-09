import { Metadata } from "next";
import DiaryView from "./DiaryView";

export const metadata: Metadata = {
  title: "Developer Diary",
  description: "Keep track of your daily tasks, learning notes, and study sessions in a structured developer diary.",
};

export default function DiaryPage() {
  return <DiaryView />;
}
