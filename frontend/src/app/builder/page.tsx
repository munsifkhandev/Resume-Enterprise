"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Download, Plus, Trash2, GraduationCap, Briefcase } from "lucide-react";

// PDF Preview Component
const ResumePreview = dynamic(() => import("../../components/ResumePreview"), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-slate-400">Loading PDF Engine...</div>
});

export default function BuilderPage() {
    // 1. REAL-TIME STATE (Form isse chalega - Fast)
    const [resumeData, setResumeData] = useState({
        fullName: "",
        email: "",
        phone: "",
        linkedin: "",
        skills: "",
        experience: [] as any[],
        education: [] as any[]
    });

    // 2. DEBOUNCED STATE (PDF isse chalega - Slow & Safe)
    const [previewData, setPreviewData] = useState(resumeData);

    // 🚀 DEBOUNCE EFFECT: 
    // Jab tak user type kar raha hai, wait karo. Jab 1 second ruk jaye, tab PDF update karo.
    useEffect(() => {
        const timer = setTimeout(() => {
            setPreviewData(resumeData);
        }, 800); // 800ms delay (Ideal for PDF)

        return () => clearTimeout(timer);
    }, [resumeData]);

    // AUTO-FILL EFFECT
    useEffect(() => {
        const savedData = localStorage.getItem("resumeData");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const newData = {
                    fullName: parsed.personal_info?.name || parsed.name || "",
                    email: parsed.personal_info?.email || parsed.email || "",
                    phone: parsed.personal_info?.phone || parsed.phone || "",
                    linkedin: parsed.personal_info?.linkedin || parsed.linkedin || "",
                    skills: Array.isArray(parsed.skills) ? parsed.skills.join(", ") : (parsed.skills || ""),
                    experience: (parsed.experience || []).map((item: any) => ({
                        role: item.role || item.title || "",
                        company: item.company || "",
                        date: item.date || "",
                        location: item.location || "",
                        description: item.description || ""
                    })),
                    education: (parsed.education || []).map((item: any) => ({
                        degree: item.degree || "",
                        school: item.school || item.university || "",
                        date: item.date || "",
                        location: item.location || ""
                    }))
                };
                setResumeData(newData);
                setPreviewData(newData); // Initial load par foran dikhao
            } catch (e) {
                console.error("Error parsing AI data", e);
            }
        }
    }, []);

    // HANDLERS
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setResumeData(prev => ({ ...prev, [name]: value }));
    };

    const handleExperienceChange = (index: number, field: string, value: string) => {
        const newExp: any = [...resumeData.experience];
        newExp[index] = { ...newExp[index], [field]: value };
        setResumeData(prev => ({ ...prev, experience: newExp }));
    };

    const handleEducationChange = (index: number, field: string, value: string) => {
        const newEdu: any = [...resumeData.education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        setResumeData(prev => ({ ...prev, education: newEdu }));
    };

    // Add/Remove Helpers
    const addExperience = () => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, { role: "", company: "", date: "", location: "", description: "" }]
        }));
    };
    const removeExperience = (index: number) => {
        const newExp = [...resumeData.experience];
        newExp.splice(index, 1);
        setResumeData(prev => ({ ...prev, experience: newExp }));
    };
    const addEducation = () => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, { degree: "", school: "", date: "", location: "" }]
        }));
    };
    const removeEducation = (index: number) => {
        const newEdu = [...resumeData.education];
        newEdu.splice(index, 1);
        setResumeData(prev => ({ ...prev, education: newEdu }));
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col h-screen font-sans">

            {/* NAVBAR */}
            <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-950 shrink-0 z-10">
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
                    <ArrowLeft size={20} /> <span className="font-bold">Back</span>
                </Link>
                <div className="flex gap-3">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2">
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>

            {/* WORKSPACE */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT: EDITOR FORM (Inputs `resumeData` use karenge - FAST) */}
                <div className="w-[40%] border-r border-slate-700 overflow-y-auto bg-slate-900 custom-scrollbar">
                    <div className="p-8 space-y-8">

                        {/* Personal Info */}
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Personal Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                                    <input type="text" name="fullName" value={resumeData.fullName || ""} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm focus:border-blue-500 outline-none transition" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Email</label>
                                    <input type="text" name="email" value={resumeData.email || ""} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm focus:border-blue-500 outline-none transition" />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 mb-1 block">Phone</label>
                                    <input type="text" name="phone" value={resumeData.phone || ""} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm focus:border-blue-500 outline-none transition" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs text-slate-400 mb-1 block">LinkedIn / Portfolio</label>
                                    <input type="text" name="linkedin" value={resumeData.linkedin || ""} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm focus:border-blue-500 outline-none transition" />
                                </div>
                            </div>
                        </section>

                        <hr className="border-slate-800" />

                        {/* Experience */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Briefcase size={14} /> Experience</h3>
                            </div>
                            {resumeData.experience.map((job, index) => (
                                <div key={index} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-4 group">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-xs text-slate-500">Position {index + 1}</span>
                                        <button onClick={() => removeExperience(index)} className="text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <input placeholder="Job Title" value={job.role || ""} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white font-bold" />
                                        <input placeholder="Company" value={job.company || ""} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white" />
                                        <input placeholder="Date" value={job.date || ""} onChange={(e) => handleExperienceChange(index, 'date', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-xs text-slate-300" />
                                        <input placeholder="Location" value={job.location || ""} onChange={(e) => handleExperienceChange(index, 'location', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-xs text-slate-300" />
                                    </div>
                                    <textarea placeholder="Job Description" value={job.description || ""} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm min-h-[80px] text-slate-300" />
                                </div>
                            ))}
                            <button onClick={addExperience} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold mt-2"><Plus size={14} /> Add Position</button>
                        </section>

                        <hr className="border-slate-800" />

                        {/* Education */}
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><GraduationCap size={14} /> Education</h3>
                            </div>
                            {resumeData.education.map((edu, index) => (
                                <div key={index} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-4 group">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-xs text-slate-500">School {index + 1}</span>
                                        <button onClick={() => removeEducation(index)} className="text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input placeholder="Degree" value={edu.degree || ""} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white font-bold" />
                                        <input placeholder="School" value={edu.school || ""} onChange={(e) => handleEducationChange(index, 'school', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm text-white" />
                                        <input placeholder="Date" value={edu.date || ""} onChange={(e) => handleEducationChange(index, 'date', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-xs text-slate-300" />
                                        <input placeholder="Location" value={edu.location || ""} onChange={(e) => handleEducationChange(index, 'location', e.target.value)} className="bg-slate-800 border border-slate-600 rounded p-2 text-xs text-slate-300" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={addEducation} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold mt-2"><Plus size={14} /> Add Education</button>
                        </section>

                        <hr className="border-slate-800" />

                        {/* Skills */}
                        <section>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Skills</h3>
                            <textarea name="skills" value={resumeData.skills || ""} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-sm min-h-[80px] focus:border-blue-500 outline-none" placeholder="Skills..." />
                        </section>

                    </div>
                </div>

                {/* RIGHT: LIVE PREVIEW (Uses 'previewData' - SLOW & SAFE) */}
                <div className="w-[60%] h-full bg-slate-800 relative">
                    <ResumePreview data={previewData} />
                </div>

            </div>
        </div>
    );
}