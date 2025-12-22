"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";


const ResumePreview = dynamic(() => import("../../components/ResumePreview"), {
    ssr: false,
    loading: () => <div className="text-white flex items-center justify-center h-full">Loading PDF Engine...</div>
});

export default function BuilderPage() {
    // Dummy Data for testing
    const dummyData = {
        name: "Munsif Khan",
        email: "munsif@example.com",
        phone: "+92 300 1234567"
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col h-screen">

            {/* Navbar */}
            <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-900">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-slate-400 hover:text-white transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="font-bold text-lg">Resume Builder <span className="text-xs bg-blue-600 px-2 py-0.5 rounded text-white ml-2">BETA</span></h1>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <Download size={16} /> Download PDF
                </button>
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT: Form (Placeholder) */}
                <div className="w-1/3 border-r border-slate-700 p-6 overflow-y-auto bg-slate-800">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Edit Details</h2>
                    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-slate-300 text-sm">
                        👈 Forms will come here.
                    </div>
                </div>

                {/* RIGHT: Live Preview */}
                <div className="w-2/3 bg-slate-500 flex justify-center items-center p-8">
                    <ResumePreview data={dummyData} />
                </div>

            </div>
        </div>
    );
}