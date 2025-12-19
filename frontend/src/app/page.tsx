"use client";
import { useState } from "react";
import axios from "axios";
import Link from "next/link"; // 👈 Navigation ke liye zaroori
import { Upload, Flame, Hammer, BarChart3, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser(); // 👈 User data yahan se milega
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState("analyze");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleProcess = async () => {
    if (!file) return alert("Please upload a PDF first!");
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    // 🔥 Agar user login hai, toh email backend bhejo
    if (user && user.primaryEmailAddress) {
      formData.append("user_email", user.primaryEmailAddress.emailAddress);
    }

    try {
      // Backend URL (Make sure backend chal raha ho)
      const res = await axios.post("http://127.0.0.1:8000/process", formData);
      setResult(res.data.data);
    } catch (e) {
      alert("Error: Backend is not running or DB error.");
    } finally {
      setLoading(false);
    }
  };

  // --- RESULT RENDER LOGIC (UI) ---
  const renderResult = () => {
    if (!result) return null;

    // 🔥 ROAST MODE UI
    if (mode === "roast") {
      return (
        <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-red-500/30 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-600 rounded-full animate-pulse">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              {result.roast_title || "Roasted!"}
            </h2>
          </div>
          <div className="space-y-4">
            {result.burns?.map((burn: string, i: number) => (
              <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
                <p className="text-lg leading-relaxed text-gray-200">💀 {burn}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-black/40 rounded-2xl border-l-4 border-red-500">
            <p className="italic text-gray-400 text-lg">"{result.overall_verdict}"</p>
          </div>
        </div>
      );
    }

    // 📊 ANALYZER / BUILDER UI
    return (
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-5">
        {/* Header Score */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              {mode === 'builder' ? <Hammer className="text-green-600" /> : <BarChart3 className="text-blue-600" />}
              {mode === 'builder' ? 'ATS Rewrite' : 'Analysis Report'}
            </h2>
            <p className="text-slate-500 mt-1">AI-generated insights</p>
          </div>
          {result.ats_score !== undefined && (
            <div className="text-center">
              <div className={`text-5xl font-black ${result.ats_score > 70 ? "text-emerald-500" : "text-blue-600"}`}>
                {result.ats_score}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Score</span>
            </div>
          )}
        </div>

        {mode === 'analyze' ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
              <h3 className="font-bold text-rose-700 mb-4 flex items-center gap-2"><AlertCircle size={20} /> Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills?.map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-white text-rose-600 text-sm font-semibold rounded-lg border border-rose-200 shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-blue-700 mb-4 flex items-center gap-2"><CheckCircle size={20} /> Improvements</h3>
              <ul className="space-y-3">
                {result.improvement_tips?.map((tip: string, i: number) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-100/50">
                    <span className="mt-1 block min-w-[6px] min-h-[6px] rounded-full bg-blue-500"></span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap bg-slate-50 p-6 rounded-xl text-sm font-mono text-slate-700 border border-slate-200 overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Resume<span className="text-blue-600">AI</span></span>
          </div>

          <div className="flex gap-4 items-center">
            {/* Login Button (Jab user logged out ho) */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-slate-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>

            {/* Profile & History (Jab user logged in ho) */}
            <SignedIn>
              <Link href="/dashboard">
                <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition mr-2">
                  History
                </button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">

        {/* HERO SECTION */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Fix your resume <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">in seconds.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-lg mx-auto">
            Use Enterprise AI to analyze, rewrite, or savagely roast your resume to perfection.
          </p>
        </div>

        {/* TABS */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex gap-1">
          {[
            { id: "analyze", label: "Analyzer", icon: BarChart3 },
            { id: "roast", label: "Roast Mode", icon: Flame },
            { id: "builder", label: "Builder", icon: Hammer }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-200 ${mode === m.id
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
            >
              <m.icon size={18} className={mode === m.id ? "text-blue-400" : ""} />
              {m.label}
            </button>
          ))}
        </div>

        {/* UPLOAD AREA */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-10">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer relative group">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Upload size={28} />
              </div>
              <div>
                <p className="font-bold text-lg text-slate-700">
                  {file ? file.name : "Drop your PDF here"}
                </p>
                <p className="text-slate-400 mt-1">or click to browse</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={loading || !file}
            className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Process Resume <ArrowRight size={20} /></>}
          </button>
        </div>

        {/* RESULTS */}
        {renderResult()}

      </main>
    </div>
  );
}