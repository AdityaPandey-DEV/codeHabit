import { Metadata } from "next";
import HabitsView from "./HabitsView";

export const metadata: Metadata = {
  title: "Habits",
  description: "Track and build positive developer habits with consistent daily logs and streak tracking.",
};

export default function HabitsPage() {
  return <HabitsView />;
}
