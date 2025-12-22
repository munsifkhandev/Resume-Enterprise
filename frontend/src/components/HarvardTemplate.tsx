import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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

    // --- HEADER SECTION ---
    headerContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        marginTop: 0,
        marginBottom: 8,
        textAlign: 'center',
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    contactText: {
        fontSize: 10,
        fontFamily: 'Times-Roman',
        color: '#000',
    },
    separator: {
        marginHorizontal: 5,
        color: '#000',
    },

    // --- SECTIONS ---
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Times-Bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 8,
        marginTop: 6,
        paddingBottom: 2,
        letterSpacing: 0.5,
    },

    // --- ENTRY BLOCKS ---
    jobBlock: {
        marginBottom: 6,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 1,
    },

    // STYLES
    companyText: {
        fontFamily: 'Times-Bold',
        fontSize: 10.5,
    },
    locationText: {
        fontFamily: 'Times-Roman',
        fontSize: 10,
    },
    roleText: {
        fontFamily: 'Times-Italic',
        fontSize: 10,
    },
    dateText: {
        fontFamily: 'Times-Italic',
        fontSize: 10,
        textAlign: 'right',
    },

    // BULLETS
    bulletContainer: {
        marginTop: 2,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 1,
        paddingLeft: 10,
    },
    bulletSymbol: {
        width: 12,
        fontSize: 12,
        lineHeight: 1,
        fontFamily: 'Times-Roman',
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        fontFamily: 'Times-Roman',
        textAlign: 'justify',
    }
});

export const HarvardTemplate = ({ data }: any) => {
    const skillsList = data.skills || "";

    const formatLink = (link: string) => link?.replace(/(^\w+:|^)\/\//, '').replace('www.', '');

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}
                <View style={styles.headerContainer}>
                    <Text style={styles.name}>{data.fullName || "YOUR NAME"}</Text>

                    <View style={styles.contactRow}>
                        {data.email ? <Text style={styles.contactText}>{data.email}</Text> : null}

                        {data.phone ? (
                            <>
                                <Text style={styles.separator}>|</Text>
                                <Text style={styles.contactText}>{data.phone}</Text>
                            </>
                        ) : null}

                        {data.linkedin ? (
                            <>
                                <Text style={styles.separator}>|</Text>
                                <Text style={styles.contactText}>{formatLink(data.linkedin)}</Text>
                            </>
                        ) : null}
                    </View>
                </View>

                {/* EDUCATION */}
                {data.education && data.education.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {data.education.map((edu: any, index: number) => (
                            <View key={index} style={styles.jobBlock}>
                                <View style={styles.row}>
                                    <Text style={styles.companyText}>{edu.school}</Text>
                                    <Text style={styles.locationText}>{edu.location}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.roleText}>{edu.degree}</Text>
                                    <Text style={styles.dateText}>{edu.date}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* EXPERIENCE (Fixed Duplication Issue) */}
                {data.experience && data.experience.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Professional Experience</Text>
                        {data.experience.map((job: any, index: number) => (
                            <View key={index} style={styles.jobBlock}>
                                <View style={styles.row}>
                                    <Text style={styles.companyText}>{job.company}</Text>
                                    <Text style={styles.locationText}>{job.location}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.roleText}>{job.role}</Text>
                                    <Text style={styles.dateText}>{job.date}</Text>
                                </View>

                                {/* ✅ FIXED BULLETS LOGIC */}
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

                {/* SKILLS */}
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

            </Page>
        </Document>
    );
};