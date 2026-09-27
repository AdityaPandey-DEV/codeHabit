import Link from "next/link";

export function AppFooter() {
  return <footer className="border-t border-[#dbe2e5] px-6 py-5 text-sm text-[#617079]">
    <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <span>CodeHabit is a personal workspace for study and coding practice.</span>
      <nav className="flex gap-5" aria-label="Legal"><Link href="/privacy" className="hover:text-[#0f766e] hover:underline">Privacy</Link><Link href="/terms" className="hover:text-[#0f766e] hover:underline">Terms</Link></nav>
    </div>
  </footer>;
}
