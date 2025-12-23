"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, GraduationCap, Briefcase, Code, Award, Globe } from "lucide-react";
import AIChat from "../../components/AIChat";

// ✅ Dynamic Imports to prevent Turbopack Crash
const ResumePreview = dynamic(() => import("../../components/ResumePreview"), {
    ssr: false,
    loading: () => <div className="text-slate-400">Loading Preview...</div>
});

const ResumeDownloader = dynamic(() => import("../../components/ResumeDownloader"), {
    ssr: false,
    loading: () => <button className="bg-slate-700 text-slate-400 px-5 py-2 rounded-lg text-sm font-bold">Loading...</button>
});

export default function BuilderPage() {
    // 1. STATE
    const [resumeData, setResumeData] = useState({
        fullName: "", email: "", phone: "", linkedin: "", portfolio: "", summary: "",
        skills: "", languages: "",
        experience: [] as any[], education: [] as any[], projects: [] as any[], certifications: [] as any[]
    });

    const [previewData, setPreviewData] = useState(resumeData);

    // 2. EFFECTS
    useEffect(() => {
        const timer = setTimeout(() => setPreviewData(resumeData), 800);
        return () => clearTimeout(timer);
    }, [resumeData]);

    useEffect(() => {
        const savedData = localStorage.getItem("resumeData");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const newData = {
                    ...resumeData, ...parsed,
                    skills: Array.isArray(parsed.skills) ? parsed.skills.join(", ") : (parsed.skills || "")
                };
                // Ensure arrays exist
                ['experience', 'education', 'projects', 'certifications'].forEach(key => {
                    if (!newData[key]) newData[key] = [];
                });
                setResumeData(newData);
                setPreviewData(newData);
            } catch (e) { console.error(e); }
        }
    }, []);

    // 3. HANDLERS
    const handleGenericChange = (e: any) => setResumeData({ ...resumeData, [e.target.name]: e.target.value });

    const handleArrayChange = (index: number, field: string, value: string, arr: 'experience' | 'education' | 'projects' | 'certifications') => {
        const newArr: any = [...resumeData[arr]];
        newArr[index] = { ...newArr[index], [field]: value };
        setResumeData({ ...resumeData, [arr]: newArr });
    };

    const addItem = (arr: 'experience' | 'education' | 'projects' | 'certifications', item: any) => {
        setResumeData({ ...resumeData, [arr]: [...resumeData[arr], item] });
    };

    const removeItem = (index: number, arr: 'experience' | 'education' | 'projects' | 'certifications') => {
        const newArr = [...resumeData[arr]];
        newArr.splice(index, 1);
        setResumeData({ ...resumeData, [arr]: newArr });
    };

    const handleAIUpdate = (newData: any) => {
        setResumeData(prev => ({ ...prev, ...newData }));
        setPreviewData(prev => ({ ...prev, ...newData }));
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col h-screen font-sans">
            {/* Navbar */}
            <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-950 shrink-0 z-10">
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white"><ArrowLeft size={20} /><span className="font-bold">Back</span></Link>
                <div className="flex gap-3">
                    {/* ✅ Safe Dynamic Downloader */}
                    <ResumeDownloader data={resumeData} fileName={`${resumeData.fullName.replace(/\s+/g, '_') || "resume"}.pdf`} />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* FORM */}
                <div className="w-[40%] border-r border-slate-700 overflow-y-auto bg-slate-900 custom-scrollbar p-8 space-y-8">
                    {/* Personal */}
                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2"><label className="text-xs text-slate-400">Full Name</label><input name="fullName" value={resumeData.fullName} onChange={handleGenericChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm" /></div>
                            <div><label className="text-xs text-slate-400">Email</label><input name="email" value={resumeData.email} onChange={handleGenericChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm" /></div>
                            <div><label className="text-xs text-slate-400">Phone</label><input name="phone" value={resumeData.phone} onChange={handleGenericChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm" /></div>
                            <div><label className="text-xs text-slate-400">LinkedIn</label><input name="linkedin" value={resumeData.linkedin} onChange={handleGenericChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm" /></div>
                            <div className="col-span-2"><label className="text-xs text-slate-400">Portfolio</label><input name="portfolio" value={resumeData.portfolio} onChange={handleGenericChange} className="w-full bg-slate-800 border border-slate-700 rounded p-2.5 text-sm" /></div>
                        </div>
                    </section>

                    <section><h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Summary</h3><textarea name="summary" value={resumeData.summary} onChange={handleGenericChange} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-sm min-h-[100px]" /></section>
                    <hr className="border-slate-800" />

                    {/* Experience */}
                    <section>
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Briefcase size={14} /> Experience</h3></div>
                        {resumeData.experience.map((job, i) => (
                            <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-4 group relative">
                                <button onClick={() => removeItem(i, 'experience')} className="absolute top-4 right-4 text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input placeholder="Role" value={job.role} onChange={(e) => handleArrayChange(i, 'role', e.target.value, 'experience')} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm font-bold" />
                                    <input placeholder="Company" value={job.company} onChange={(e) => handleArrayChange(i, 'company', e.target.value, 'experience')} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm" />
                                    <input placeholder="Date" value={job.date} onChange={(e) => handleArrayChange(i, 'date', e.target.value, 'experience')} className="bg-slate-800 border border-slate-600 rounded p-2 text-xs" />
                                    <input placeholder="Location" value={job.location} onChange={(e) => handleArrayChange(i, 'location', e.target.value, 'experience')} className="bg-slate-800 border border-slate-600 rounded p-2 text-xs" />
                                </div>
                                <textarea placeholder="Description" value={job.description} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'experience')} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm min-h-[80px]" />
                            </div>
                        ))}
                        <button onClick={() => addItem('experience', { role: "", company: "", date: "", location: "", description: "" })} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold mt-2"><Plus size={14} /> Add Experience</button>
                    </section>
                    <hr className="border-slate-800" />

                    {/* Projects */}
                    <section>
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Code size={14} /> Projects</h3></div>
                        {resumeData.projects.map((proj, i) => (
                            <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-4 relative">
                                <button onClick={() => removeItem(i, 'projects')} className="absolute top-4 right-4 text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <input placeholder="Title" value={proj.title} onChange={(e) => handleArrayChange(i, 'title', e.target.value, 'projects')} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm font-bold" />
                                    <input placeholder="Link" value={proj.link} onChange={(e) => handleArrayChange(i, 'link', e.target.value, 'projects')} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm" />
                                </div>
                                <textarea placeholder="Description" value={proj.description} onChange={(e) => handleArrayChange(i, 'description', e.target.value, 'projects')} className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-sm min-h-[60px]" />
                            </div>
                        ))}
                        <button onClick={() => addItem('projects', { title: "", link: "", description: "" })} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold mt-2"><Plus size={14} /> Add Project</button>
                    </section>
                    <hr className="border-slate-800" />

                    {/* Education */}
                    <section>
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><GraduationCap size={14} /> Education</h3></div>
                        {resumeData.education.map((edu, i) => (
                            <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-4 relative">
                                <button onClick={() => removeItem(i, 'education')} className="absolute top-4 right-4 text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
                                <div className="grid grid-cols-2 gap-3">
                                    <input placeholder="Degree" value={edu.degree} onChange={(e) => handleArrayChange(i, 'degree', e.target.value, 'education')} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm font-bold" />
                                    <input placeholder="School" value={edu.school} onChange={(e) => handleArrayChange(i, 'school', e.target.value, 'education')} className="bg-slate-800 border border-slate-600 rounded p-2 text-sm" />
                                    <input placeholder="Date" value={edu.date} onChange={(e) => handleArrayChange(i, 'date', e.target.value, 'education')} className="bg-slate-800 border border-slate-600 rounded p-2 text-xs" />
                                    <input placeholder="Location" value={edu.location} onChange={(e) => handleArrayChange(i, 'location', e.target.value, 'education')} className="bg-slate-800 border border-slate-600 rounded p-2 text-xs" />
                                </div>
                            </div>
                        ))}
                        <button onClick={() => addItem('education', { degree: "", school: "", date: "", location: "" })} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold mt-2"><Plus size={14} /> Add Education</button>
                    </section>
                    <hr className="border-slate-800" />

                    {/* Skills & Languages */}
                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Skills & Languages</h3>
                        <div className="space-y-4">
                            <div><label className="text-xs text-slate-400 mb-1 block">Skills</label><textarea name="skills" value={resumeData.skills} onChange={handleGenericChange} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-sm min-h-[60px]" /></div>
                            <div><label className="text-xs text-slate-400 mb-1 block flex items-center gap-2"><Globe size={12} /> Languages</label><input name="languages" value={resumeData.languages} onChange={handleGenericChange} className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-sm" /></div>
                        </div>
                    </section>
                    <hr className="border-slate-800" />

                    {/* Certifications */}
                    <section>
                        <div className="flex justify-between items-center mb-4"><h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2"><Award size={14} /> Certifications</h3></div>
                        {resumeData.certifications.map((cert, i) => (
                            <div key={i} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 mb-3 flex gap-2">
                                <input placeholder="Name" value={cert.name} onChange={(e) => handleArrayChange(i, 'name', e.target.value, 'certifications')} className="flex-1 bg-slate-800 border border-slate-600 rounded p-2 text-sm" />
                                <input placeholder="Date" value={cert.date} onChange={(e) => handleArrayChange(i, 'date', e.target.value, 'certifications')} className="w-24 bg-slate-800 border border-slate-600 rounded p-2 text-sm text-center" />
                                <button onClick={() => removeItem(i, 'certifications')} className="text-red-400 px-2"><Trash2 size={16} /></button>
                            </div>
                        ))}
                        <button onClick={() => addItem('certifications', { name: "", date: "" })} className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold mt-2"><Plus size={14} /> Add Cert</button>
                    </section>
                </div>

                {/* PREVIEW */}
                <div className="w-[60%] h-full bg-slate-800 relative">
                    <ResumePreview data={previewData} />
                </div>
            </div>
            <AIChat resumeData={resumeData} onUpdate={handleAIUpdate} />
        </div>
    );
}