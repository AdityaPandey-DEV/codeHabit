import Link from "next/link";

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: { title: string; body: string }[] }) {
 return <main className="min-h-screen bg-[#f7f8fa] px-5 py-10 text-[#15212b] sm:px-8 sm:py-16"><article className="mx-auto max-w-3xl rounded-lg border border-[#dbe2e5] bg-white p-7 shadow-sm sm:p-10"><Link href="/auth" className="text-sm font-medium text-[#0f766e] hover:underline">CodeHabit</Link><h1 className="mt-6 text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-4 leading-7 text-[#52626b]">{intro}</p><div className="mt-10 space-y-8">{sections.map(s => <section key={s.title}><h2 className="text-lg font-semibold">{s.title}</h2><p className="mt-2 leading-7 text-[#52626b]">{s.body}</p></section>)}</div><p className="mt-10 border-t border-[#dbe2e5] pt-5 text-sm text-[#617079]">Last updated: September 26, 2026</p></article></main>;
}
