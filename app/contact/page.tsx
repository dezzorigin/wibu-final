export default function ContactPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white">Contact</h1>
      <p className="text-white/60 text-sm md:text-base leading-relaxed">
        WibuFinal has no support desk, no email inbox, and no social accounts. It is a small
        open-source project.
      </p>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-bold text-white mb-2">Found a bug or have a suggestion?</h2>
        <p className="text-sm text-zinc-400 leading-relaxed mb-4">
          Open an issue on GitHub — that is the only inbox this project reads.
        </p>
        <a
          href="https://github.com/dezzorigin/wibu-final/issues"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff4e00] hover:bg-[#ff9d00] text-zinc-950 font-bold rounded-xl text-sm transition-colors"
        >
          Open an issue on GitHub
        </a>
      </div>
      <p className="text-sm text-white/40 leading-relaxed">
        Please do not report broken video streams here — the player is a third-party mirror
        and stream availability is outside this project&apos;s control (see the FAQ).
      </p>
    </div>
  );
}
