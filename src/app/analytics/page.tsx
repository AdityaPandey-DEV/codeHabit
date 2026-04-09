import { Metadata } from "next";
import AnalyticsView from "./AnalyticsView";

export const metadata: Metadata = {
  title: "Productivity Analytics",
  description: "Visualize correlations between your coding habits and daily productivity for better developer growth.",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
