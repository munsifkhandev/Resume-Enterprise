"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 👈 Import Router for redirect
// ✅ All Icons Imported Correctly
import { Upload, Flame, Hammer, BarChart3, Loader2, CheckCircle, AlertCircle, ArrowRight, X, FileText } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function Home() {
  const { user } = useUser();
  const router = useRouter(); // 👈 Initialize Router
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [mode, setMode] = useState("analyze");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // PDF Preview URL Generator
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPdfUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleProcess = async () => {
    if (!file) return alert("Please upload a PDF first!");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);

    if (user && user.primaryEmailAddress) {
      formData.append("user_email", user.primaryEmailAddress.emailAddress);
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/process", formData);

      // 🚀 BUILDER MODE REDIRECT LOGIC
      if (mode === "builder") {
        const aiData = res.data.data;
        // Data ko save karo taaki next page par mile
        localStorage.setItem("resumeData", JSON.stringify(aiData));
        // Redirect to Builder Page
        router.push("/builder");
        return;
      }

      // Normal Modes (Analyze/Roast)
      setResult(res.data.data);
    } catch (e) {
      alert("Error: Backend is not running or DB error.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setFile(null);
    setPdfUrl(null);
  };

  // --- RESULT RENDER LOGIC ---
  const renderResult = () => {
    if (!result) return null;

    // 🛑 1. ERROR HANDLING
    if (result.error) {
      return (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-700 animate-in fade-in">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <AlertCircle /> AI Error
          </h3>
          <p className="text-sm font-mono bg-white/50 p-3 rounded border border-red-100">
            {result.error}
          </p>
          <p className="text-xs text-red-500 mt-2">Possible reasons: PDF too long, server busy, or invalid text.</p>
          <button onClick={handleProcess} className="mt-4 text-sm font-bold underline hover:text-red-900">Try Again</button>
        </div>
      );
    }

    // 🔥 2. ROAST MODE
    if (mode === "roast") {
      return (
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-red-500/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-600 rounded-full animate-pulse"><Flame className="w-5 h-5 text-white" /></div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              {result.roast_title || "Roasted!"}
            </h2>
          </div>
          <div className="space-y-3">
            {result.burns?.map((burn: string, i: number) => (
              <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/10 text-sm text-gray-300">💀 {burn}</div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-black/40 rounded-xl border-l-4 border-red-500 italic text-gray-400 text-sm">
            "{result.overall_verdict}"
          </div>
        </div>
      );
    }

    // 📊 3. ANALYZER UI (Enterprise Grade)
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">

        {/* HEADER: Total Score */}
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="text-blue-600" />
              Analysis Report
            </h2>
            <p className="text-sm text-slate-500 mt-1">Enterprise Grade Assessment</p>
          </div>

          {/* Main Score Circle */}
          {result.ats_score !== undefined && (
            <div className="text-center">
              <div className={`text-5xl font-black tracking-tighter ${result.ats_score > 80 ? "text-emerald-500" :
                result.ats_score > 60 ? "text-yellow-500" : "text-red-500"
                }`}>
                {result.ats_score}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* 🔥 SCORE BREAKDOWN */}
          {result.score_breakdown && (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(result.score_breakdown).map(([key, val]: any) => (
                <div key={key} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-1 uppercase">
                    <span>{key}</span>
                    <span>{val}/25</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${val >= 20 ? "bg-emerald-500" :
                        val >= 15 ? "bg-blue-500" :
                          val >= 10 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      style={{ width: `${(val / 25) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Missing Skills Section */}
          <div className="bg-rose-50/50 p-5 rounded-xl border border-rose-100">
            <h3 className="font-bold text-rose-700 mb-3 flex items-center gap-2 text-sm"><AlertCircle size={16} /> Critical Gaps</h3>
            <div className="flex flex-wrap gap-2">
              {result.missing_skills?.length > 0 ? (
                result.missing_skills.map((skill: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 bg-white text-rose-700 text-xs font-semibold rounded-md border border-rose-200 shadow-sm">
                    {skill}
                  </span>
                ))
              ) : <span className="text-xs text-rose-400 italic">No major skills missing.</span>}
            </div>
          </div>

          {/* Improvements Section */}
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2 text-sm"><CheckCircle size={16} /> Expert Recommendations</h3>
            <ul className="space-y-3">
              {result.improvement_tips?.length > 0 ? (
                result.improvement_tips.map((tip: string, i: number) => (
                  <li key={i} className="text-sm text-slate-700 flex items-start gap-3 bg-white p-3 rounded-lg border border-blue-100/50 shadow-sm">
                    <span className="mt-1.5 block min-w-[6px] min-h-[6px] rounded-full bg-blue-500"></span>
                    {tip}
                  </li>
                ))
              ) : <span className="text-xs text-blue-400 italic">Resume looks good!</span>}
            </ul>
          </div>

          {/* Summary Section */}
          {result.summary && (
            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Summary:</span>
              {result.summary}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-blue-100 flex flex-col">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-800">Resume<span className="text-blue-600">AI</span></span>
          </div>

          <div className="flex gap-4 items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard"><button className="text-sm font-medium text-slate-500 hover:text-slate-900 mr-2">History</button></Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6">

        {/* VIEW 1: UPLOAD MODE */}
        {!result ? (
          <div className="max-w-2xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Optimize your resume <span className="text-blue-600">with AI</span>
              </h1>
              <p className="text-slate-500">Analyze, Roast, or Rewrite in seconds.</p>
            </div>

            {/* TABS */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-6 flex gap-1">
              {[
                { id: "analyze", label: "Analyzer", icon: BarChart3 },
                { id: "roast", label: "Roast", icon: Flame },
                { id: "builder", label: "Builder", icon: Hammer }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${mode === m.id
                    ? "bg-slate-900 text-white shadow"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <m.icon size={16} className={mode === m.id ? "text-blue-400" : ""} />
                  {m.label}
                </button>
              ))}
            </div>

            {/* UPLOAD BOX */}
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50/30 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Upload size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">{file ? file.name : "Upload PDF Resume"}</p>
                    <p className="text-xs text-slate-400 mt-1">PDF up to 5MB</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProcess}
                disabled={loading || !file}
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Process Resume <ArrowRight size={18} /></>}
              </button>
            </div>
          </div>
        ) : (

          // VIEW 2: SPLIT SCREEN (Only for Analyze/Roast)
          <div className="grid lg:grid-cols-2 gap-6 h-[85vh] animate-in fade-in">
            {/* LEFT: PDF VIEWER */}
            <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
              <div className="bg-slate-900 p-3 flex justify-between items-center border-b border-slate-700">
                <span className="text-white text-sm font-medium flex items-center gap-2"><FileText size={16} /> Original Resume</span>
                <button onClick={resetAnalysis} className="text-slate-400 hover:text-white"><X size={18} /></button>
              </div>
              <div className="flex-1 bg-slate-500 relative">
                {pdfUrl && (
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0`}
                    className="w-full h-full absolute inset-0"
                    title="Resume PDF"
                  />
                )}
              </div>
            </div>

            {/* RIGHT: AI ANALYSIS */}
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
              {renderResult()}

              <div className="mt-4 flex gap-2 justify-end">
                <button onClick={resetAnalysis} className="text-sm text-slate-500 hover:text-slate-900 underline">Upload Another</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}