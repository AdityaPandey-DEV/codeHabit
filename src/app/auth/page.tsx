import { Metadata } from "next";
import AuthView from "./AuthView";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Securely sign in to CodeHabit to access your personal dashboard and productivity data.",
};

export default function AuthPage() {
  return <AuthView />;
}
