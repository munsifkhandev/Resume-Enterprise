"use client";
import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { HarvardTemplate } from './HarvardTemplate';

interface Props {
    data: any;
}

const ResumePreview = ({ data }: Props) => {
    return (

        <PDFViewer
            key={JSON.stringify(data)}
            className="w-full h-full border-none"
            showToolbar={true}
        >
            <HarvardTemplate data={data} />
        </PDFViewer>
    );
};

export default ResumePreview;