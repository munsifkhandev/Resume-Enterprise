// frontend/src/components/ResumePreview.tsx
"use client";
import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { HarvardTemplate } from './HarvardTemplate';

interface Props {
    data: any;
}

const ResumePreview = ({ data }: Props) => {
    return (
        <PDFViewer className="w-full h-full shadow-2xl rounded-lg" showToolbar={true}>
            <HarvardTemplate data={data} />
        </PDFViewer>
    );
};

export default ResumePreview;