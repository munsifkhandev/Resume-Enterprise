import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';

// --- STYLES ---
const styles = StyleSheet.create({
    page: {
        paddingTop: 30,
        paddingBottom: 30,
        paddingHorizontal: 40,
        fontFamily: 'Times-Roman',
        fontSize: 10,
        lineHeight: 1.3,
        color: '#000',
    },

    // --- HEADER (Optimized for No Overlap) ---
    headerContainer: {
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 0.5, // Standard separator line
        borderBottomColor: '#000',
        paddingBottom: 8,
    },
    name: {
        fontSize: 22,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        marginTop: 0,
        marginBottom: 6,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap', // Prevents overflow/overlap
        gap: 4,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactText: {
        fontSize: 9.5,
        fontFamily: 'Times-Roman',
        color: '#000',
        lineHeight: 1.4,
    },
    separator: {
        marginHorizontal: 4,
        color: '#000',
        fontSize: 9.5,
    },

    // --- SECTIONS ---
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 6,
        marginTop: 8,
        paddingBottom: 2,
        letterSpacing: 0.5,
    },

    // --- BLOCKS ---
    jobBlock: { marginBottom: 8 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2 },

    // TEXT STYLES
    boldText: { fontFamily: 'Times-Bold', fontSize: 10 },
    italicText: { fontFamily: 'Times-Italic', fontSize: 10 },
    regularText: { fontFamily: 'Times-Roman', fontSize: 10 },

    // BULLETS
    bulletContainer: { marginTop: 2 },
    bulletPoint: { flexDirection: 'row', marginBottom: 1, paddingLeft: 10 },
    bulletSymbol: { width: 12, fontSize: 12, lineHeight: 1, fontFamily: 'Times-Roman' },
    bulletText: { flex: 1, fontSize: 10, fontFamily: 'Times-Roman', textAlign: 'justify' }
});

export const HarvardTemplate = ({ data }: any) => {
    const skillsList = data.skills || "";

    // Helper to remove https:// for cleaner print display
    const formatLink = (link: string) => link?.replace(/(^\w+:|^)\/\//, '').replace('www.', '');

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* 1. HEADER */}
                <View style={styles.headerContainer}>
                    <Text style={styles.name}>{data.fullName || "YOUR NAME"}</Text>

                    <View style={styles.contactRow}>
                        {/* Email */}
                        {data.email && (
                            <View style={styles.contactItem}>
                                <Text style={styles.contactText}>{data.email}</Text>
                            </View>
                        )}

                        {/* Phone */}
                        {data.phone && (
                            <View style={styles.contactItem}>
                                {data.email && <Text style={styles.separator}>|</Text>}
                                <Text style={styles.contactText}>{data.phone}</Text>
                            </View>
                        )}

                        {/* LinkedIn */}
                        {data.linkedin && (
                            <View style={styles.contactItem}>
                                {(data.email || data.phone) && <Text style={styles.separator}>|</Text>}
                                <Link src={data.linkedin} style={{ textDecoration: 'none' }}>
                                    <Text style={styles.contactText}>{formatLink(data.linkedin)}</Text>
                                </Link>
                            </View>
                        )}

                        {/* Portfolio */}
                        {data.portfolio && (
                            <View style={styles.contactItem}>
                                {(data.email || data.phone || data.linkedin) && <Text style={styles.separator}>|</Text>}
                                <Link src={data.portfolio} style={{ textDecoration: 'none' }}>
                                    <Text style={styles.contactText}>{formatLink(data.portfolio)}</Text>
                                </Link>
                            </View>
                        )}
                    </View>
                </View>

                {/* 2. SUMMARY */}
                {data.summary && (
                    <View style={{ marginBottom: 10 }}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={{ fontSize: 10, fontFamily: 'Times-Roman', textAlign: 'justify', lineHeight: 1.4 }}>
                            {data.summary}
                        </Text>
                    </View>
                )}

                {/* 3. EDUCATION */}
                {data.education && data.education.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {data.education.map((edu: any, index: number) => (
                            <View key={index} style={styles.jobBlock}>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>{edu.school}</Text>
                                    <Text style={styles.regularText}>{edu.location}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.italicText}>{edu.degree}</Text>
                                    <Text style={styles.italicText}>{edu.date}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* 4. EXPERIENCE */}
                {data.experience && data.experience.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Professional Experience</Text>
                        {data.experience.map((job: any, index: number) => (
                            <View key={index} style={styles.jobBlock}>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>{job.company}</Text>
                                    <Text style={styles.regularText}>{job.location}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.italicText}>{job.role}</Text>
                                    <Text style={styles.italicText}>{job.date}</Text>
                                </View>
                                {job.description ? (
                                    <View style={styles.bulletContainer}>
                                        {job.description.split(/\n|•/).map((line: string, i: number) =>
                                            line.trim().length > 0 ? (
                                                <View key={i} style={styles.bulletPoint}>
                                                    <Text style={styles.bulletSymbol}>•</Text>
                                                    <Text style={styles.bulletText}>{line.trim()}</Text>
                                                </View>
                                            ) : null
                                        )}
                                    </View>
                                ) : null}
                            </View>
                        ))}
                    </View>
                )}

                {/* 5. KEY PROJECTS */}
                {data.projects && data.projects.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Key Projects</Text>
                        {data.projects.map((proj: any, index: number) => (
                            <View key={index} style={styles.jobBlock}>
                                <View style={styles.row}>
                                    <Text style={styles.boldText}>{proj.title}</Text>
                                    {proj.link ? (
                                        <Link src={proj.link} style={{ textDecoration: 'none' }}>
                                            <Text style={styles.regularText}>{formatLink(proj.link)}</Text>
                                        </Link>
                                    ) : null}
                                </View>
                                {proj.description ? (
                                    <View style={styles.bulletContainer}>
                                        {proj.description.split(/\n|•/).map((line: string, i: number) =>
                                            line.trim().length > 0 ? (
                                                <View key={i} style={styles.bulletPoint}>
                                                    <Text style={styles.bulletSymbol}>•</Text>
                                                    <Text style={styles.bulletText}>{line.trim()}</Text>
                                                </View>
                                            ) : null
                                        )}
                                    </View>
                                ) : null}
                            </View>
                        ))}
                    </View>
                )}

                {/* 6. TECHNICAL SKILLS */}
                {skillsList ? (
                    <View>
                        <Text style={styles.sectionTitle}>Technical Skills</Text>
                        <View style={{ marginTop: 2 }}>
                            <Text style={{ fontFamily: 'Times-Roman', fontSize: 10, lineHeight: 1.4 }}>
                                {skillsList}
                            </Text>
                        </View>
                    </View>
                ) : null}

                {/* 7. CERTIFICATIONS & LANGUAGES */}
                {((data.certifications && data.certifications.length > 0) || data.languages) && (
                    <View>
                        <Text style={styles.sectionTitle}>Certifications & Additional Info</Text>

                        {/* Certifications List */}
                        {data.certifications && data.certifications.map((cert: any, index: number) => (
                            <View key={index} style={{ flexDirection: 'row', marginBottom: 2 }}>
                                <Text style={{ ...styles.boldText, width: '85%' }}>• {cert.name}</Text>
                                <Text style={{ ...styles.italicText, width: '15%', textAlign: 'right' }}>{cert.date}</Text>
                            </View>
                        ))}

                        {/* Languages Line */}
                        {data.languages ? (
                            <View style={{ marginTop: 4 }}>
                                <Text style={{ fontSize: 10, fontFamily: 'Times-Roman' }}>
                                    <Text style={styles.boldText}>Languages: </Text>
                                    {data.languages}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                )}

            </Page>
        </Document>
    );
};