import React, { useState, useMemo } from "react";
import { Client } from "@gradio/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Github, ExternalLink, Sparkles } from "lucide-react";

// Dark neon spell-corrector UI that calls your Hugging Face Space via @gradio/client
// Space: https://huggingface.co/spaces/Priyanshu161/spell-corrector
// Deploy: Drop this file into a React/Vite app as App.jsx (or any component) and deploy to Netlify.

export default function App() {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]); // [{term, prob}]

  // Subtle animated gradient background
  const bgGradient = useMemo(
    () =>
      "bg-[radial-gradient(1200px_600px_at_10%_10%,#1f2937_0%,transparent_60%),radial-gradient(1000px_600px_at_90%_30%,#0f172a_0%,transparent_60%),conic-gradient(from_180deg_at_50%_50%,#111827,#0b1021,#0f172a,#111827)]",
    []
  );

  const connectAndPredict = async (inputWord) => {
  // Connect directly using your Space ID
  const client = await Client.connect("Priyanshu161/spell-corrector");

  // Call the /predict function with the correct parameter name
  const result = await client.predict("/predict", {
    word: inputWord, // must match the label name in Gradio: "Enter a word"
  });

  return result; // result.data will be like ["✅ The word is already spelled correctly!"]
};


  const parseSuggestions = (s) => {
  const lines = String(s)
    .split(/\r?\n/)
    .map((t) => t.trim())
    .filter(Boolean);

  const parsed = [];
  for (const line of lines) {
    if (/already spelled correctly/i.test(line)) {
      parsed.push({ term: line, prob: NaN });
    } else if (/no suggestions/i.test(line)) {
      parsed.push({ term: line, prob: NaN });
    } else {
      const m = line.match(/^([^()]+)\s*\(prob:\s*([0-9]*\.?[0-9]+)\)$/i);
      if (m) {
        parsed.push({ term: m[1].trim(), prob: Number(m[2]) });
      } else {
        parsed.push({ term: line, prob: NaN });
      }
    }
  }
  return parsed;
};

  

  const onSubmit = async (e) => {
    e?.preventDefault();
    setError("");
    setRows([]);
    const input = word.trim();
    if (!input) return;

    setLoading(true);
    try {
      const res = await connectAndPredict(input);
      // result.data is usually an array with first element being the textbox string
      const payload = Array.isArray(res?.data) ? res.data[0] : "";
      const parsed = parseSuggestions(payload);
      setRows(parsed);
    } catch (err) {
      console.error(err);
      setError(
        "Couldn't reach the Spell Corrector Space. Please try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${bgGradient} text-slate-200 relative overflow-hidden`}> 
      {/* Floating glow orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-40"
           style={{ background: "radial-gradient(circle at 30% 30%, #22d3ee, transparent 60%)" }} />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-30"
           style={{ background: "radial-gradient(circle at 70% 70%, #a78bfa, transparent 60%)" }} />

      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <motion.div initial={{ rotate: -10, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 160, damping: 12 }}
            className="p-3 rounded-2xl bg-black/40 backdrop-blur border border-white/10 shadow-xl">
            <Sparkles className="h-6 w-6" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Spell Corrector</h1>
            <p className="text-slate-400 text-sm md:text-base">Checks misspellings and suggests top candidates via your Hugging Face Space.</p>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-3xl p-[1px] bg-gradient-to-br from-cyan-400/60 via-fuchsia-500/50 to-indigo-500/50 shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)]"
        >
          <div className="rounded-3xl bg-[#0b1021]/80 backdrop-blur p-6 md:p-8 border border-white/10">
            <form onSubmit={onSubmit} className="grid gap-4 md:gap-5">
              <label className="text-sm text-slate-300">Enter a word to check</label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder="Type a misspelled word…"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10 transition"
                  />
                  <Search className="absolute right-3 top-3.5 h-5 w-5 text-slate-500" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-medium \
                             bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-indigo-500 \
                             hover:from-cyan-400 hover:via-fuchsia-400 hover:to-indigo-400 \
                             disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                  <Zap className="h-5 w-5" />
                  {loading ? "Checking…" : "Check"}

                  {/* Animated shimmer underline */}
                  <span className="absolute inset-0 rounded-2xl ring-0 ring-white/0 hover:ring-2 hover:ring-white/10 transition" />
                </button>
              </div>
            </form>

            {/* Loading animation */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 flex items-center gap-3 text-slate-300"
                >
                  <motion.div
                    className="h-2 w-2 rounded-full bg-cyan-400"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-fuchsia-400"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
                  />
                  <motion.div
                    className="h-2 w-2 rounded-full bg-indigo-400"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}
                  />
                  <span className="text-sm">Analyzing with Hugging Face Space…</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {error && (
              <div className="mt-6 text-rose-300 text-sm bg-rose-900/20 border border-rose-800/30 rounded-xl p-3">
                {error}
              </div>
            )}

            {/* Results */}
            <AnimatePresence>
              {!loading && rows.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6"
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-slate-300 text-sm">
                        <tr>
                          <th className="py-3 px-4">Suggestion</th>
                          <th className="py-3 px-4">Probability</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r, idx) => (
                          <tr key={idx} className="border-t border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 font-medium text-slate-100">{r.term}</td>
                            <td className="py-3 px-4 tabular-nums text-slate-200">
                              {isNaN(r.prob) ? "—" : r.prob.toFixed(6)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Links */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <a
                href="https://huggingface.co/spaces/Priyanshu161/spell-corrector"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-slate-200 transition"
              >
                <ExternalLink className="h-4 w-4" /> Space API
              </a>
              <span className="opacity-50">•</span>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-slate-200 transition"
              >
                <Github className="h-4 w-4" /> Source
              </a>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-slate-500">
          Built with <span className="text-cyan-300">React</span>, <span className="text-fuchsia-300">Framer Motion</span>, and <span className="text-indigo-300">@gradio/client</span>.
        </div>
      </main>
    </div>
  );
}
