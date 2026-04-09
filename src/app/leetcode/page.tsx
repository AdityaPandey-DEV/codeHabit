import { Metadata } from "next";
import LeetCodeView from "./LeetCodeView";

export const metadata: Metadata = {
  title: "LeetCode Activity",
  description: "Monitor your coding consistency with synced LeetCode submission data and heatmaps.",
};

export default function LeetCodePage() {
  return <LeetCodeView />;
}
