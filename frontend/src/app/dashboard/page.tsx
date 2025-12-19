"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr"; // 👈 Magic Import
import { ArrowLeft, Calendar, BarChart3, Flame, Hammer, Loader2 } from "lucide-react";

// Fetcher Function (SWR ke liye)
const fetcher = (url: string) => axios.get(url).then((res) => res.data.data);

export default function Dashboard() {
    const { user, isLoaded } = useUser();

    // 👇 SWR LOGIC: 
    // Agar email hai toh API call karo, nahi toh ruk jao (null).
    // Yeh data ko cache kar lega. Dubara aane par loading nahi dikhegi.
    const { data: history, error, isLoading } = useSWR(
        user?.primaryEmailAddress?.emailAddress
            ? `http://127.0.0.1:8000/history?user_email=${user.primaryEmailAddress.emailAddress}`
            : null,
        fetcher
    );

    // Loading State
    if (!isLoaded || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 bg-white rounded-full border hover:bg-slate-100 transition">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">Your History</h1>
                    </div>
                    <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border shadow-sm">
                        Total Scans: <span className="font-bold text-blue-600">{history?.length || 0}</span>
                    </div>
                </div>

                {/* List of Cards */}
                <div className="grid gap-4">
                    {!history || history.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-400">No resumes scanned yet.</p>
                            <Link href="/" className="text-blue-600 font-bold mt-2 inline-block hover:underline">Scan New Resume</Link>
                        </div>
                    ) : (
                        // History Items Map
                        history.map((item: any) => (
                            <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition flex justify-between items-center group animate-in fade-in duration-300">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg transition-colors ${item.mode === 'roast' ? 'bg-red-50 text-red-600 group-hover:bg-red-100' :
                                            item.mode === 'builder' ? 'bg-green-50 text-green-600 group-hover:bg-green-100' :
                                                'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                                        }`}>
                                        {item.mode === 'roast' ? <Flame size={24} /> : item.mode === 'builder' ? <Hammer size={24} /> : <BarChart3 size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition">{item.filename}</h3>
                                        <div className="flex gap-4 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}</span>
                                            <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold border">{item.mode}</span>
                                        </div>
                                    </div>
                                </div>

                                {item.ai_score > 0 && (
                                    <div className="text-right">
                                        <div className={`text-3xl font-black ${item.ai_score > 70 ? "text-emerald-500" : "text-blue-600"}`}>
                                            {item.ai_score}
                                        </div>
                                        <div className="text-xs text-slate-400 font-bold uppercase">Score</div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}