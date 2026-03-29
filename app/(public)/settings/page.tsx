import type { Metadata } from "next";
import { ReaderSettingsPage } from "@/components/settings/ReaderSettingsPage";

export const metadata: Metadata = {
  title: "Reader Settings",
  description: "Manage digest delivery, in-app alerts, and the topics you follow on Monochrome News Flash.",
};

export default function SettingsPage() {
  return <ReaderSettingsPage />;
}
