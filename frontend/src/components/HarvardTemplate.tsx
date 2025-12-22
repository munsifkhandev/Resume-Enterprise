import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, lineHeight: 1.5 },
    header: { marginBottom: 20, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10 },
    name: { fontSize: 24, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 5 },
    contact: { fontSize: 10, color: '#333' },
    section: { marginBottom: 15 },
    sectionTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 8, textTransform: 'uppercase', paddingBottom: 2 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    bold: { fontFamily: 'Helvetica-Bold' },
    italic: { fontFamily: 'Helvetica-Oblique' },
    bulletPoint: { flexDirection: 'row', marginBottom: 2, paddingLeft: 10 },
    bullet: { width: 10 },
    bulletText: { flex: 1 },
});

export const HarvardTemplate = ({ data }: any) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* 1. HEADER */}
            <View style={styles.header}>
                <Text style={styles.name}>{data.fullName || "YOUR NAME"}</Text>
                <Text style={styles.contact}>
                    {data.email} | {data.phone} | {data.linkedin}
                </Text>
            </View>

            {/* 2. EXPERIENCE (Dynamic Map) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {data.experience?.map((job: any, index: number) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                        <View style={styles.row}>
                            <Text style={styles.bold}>{job.role}</Text>
                            <Text>{job.date}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.italic}>{job.company}</Text>
                            <Text>{job.location}</Text>
                        </View>
                        <View style={{ marginTop: 2 }}>
                            <Text style={styles.bulletText}>{job.description}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* 3. EDUCATION (Dynamic Map) */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education?.map((edu: any, index: number) => (
                    <View key={index} style={{ marginBottom: 5 }}>
                        <View style={styles.row}>
                            <Text style={styles.bold}>{edu.degree}</Text>
                            <Text>{edu.date}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text>{edu.school}</Text>
                            <Text>{edu.location}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* 4. SKILLS */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text>{data.skills}</Text>
            </View>

        </Page>
    </Document>
);