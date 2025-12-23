"use client";
import React from 'react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { HarvardTemplate } from "./HarvardTemplate";
import { Download } from "lucide-react";

export default function ResumeDownloader({ data, fileName }: any) {
    return (
        <PDFDownloadLink
            document={<HarvardTemplate data={data} />}
            fileName={fileName}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 no-underline"
        >
            {({ loading }) => (
                loading ? "Preparing..." : <><Download size={16} /> PDF Ready</>
            )}
        </PDFDownloadLink>
    );
}