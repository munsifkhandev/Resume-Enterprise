"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar, BarChart3, Flame, Hammer, Loader2 } from "lucide-react";

export default function Dashboard() {
    const { user, isLoaded } = useUser();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
            fetchHistory(user.primaryEmailAddress.emailAddress);
        }
    }, [user]);

    const fetchHistory = async (email: string) => {
        try {
            // Backend se data mangna
            const res = await axios.get(`http://127.0.0.1:8000/history?user_email=${email}`);
            setHistory(res.data.data);
        } catch (e) {
            console.error("Error fetching history");
        } finally {
            setLoading(false);
        }
    };

    // Agar user login nahi hai ya load ho raha hai
    if (!isLoaded || loading) {
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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 bg-white rounded-full border hover:bg-slate-100 transition">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </Link>
                        <h1 className="text-3xl font-bold text-slate-900">Your History</h1>
                    </div>
                    <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border">
                        Total Scans: <span className="font-bold text-blue-600">{history.length}</span>
                    </div>
                </div>

                {/* List of Cards */}
                <div className="grid gap-4">
                    {history.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-400">No resumes scanned yet.</p>
                            <Link href="/" className="text-blue-600 font-bold mt-2 inline-block">Scan New Resume</Link>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition flex justify-between items-center">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${item.mode === 'roast' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {item.mode === 'roast' ? <Flame size={24} /> : item.mode === 'builder' ? <Hammer size={24} /> : <BarChart3 size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{item.filename}</h3>
                                        <div className="flex gap-4 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(item.created_at).toLocaleDateString()}</span>
                                            <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold border">{item.mode}</span>
                                        </div>
                                    </div>
                                </div>

                                {item.ai_score > 0 && (
                                    <div className="text-right">
                                        <div className={`text-3xl font-black ${item.ai_score > 70 ? "text-green-500" : "text-blue-600"}`}>
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