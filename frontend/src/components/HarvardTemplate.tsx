import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// 1. Styles Define karna (CSS jaisa, par PDF ke liye)
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 10,
    },
    name: {
        fontSize: 24,
        fontFamily: 'Helvetica-Bold',
        textTransform: 'uppercase',
        marginBottom: 5,
    },
    contact: {
        fontSize: 10,
        color: '#333',
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    bold: {
        fontFamily: 'Helvetica-Bold',
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 10,
    },
    bullet: {
        width: 10,
    },
    bulletText: {
        flex: 1,
    },
});

// 2. Resume Data Prop (Abhi ke liye dummy data lenge)
interface ResumeProps {
    data?: any;
}

// 3. The Document Component
export const HarvardTemplate = ({ data }: ResumeProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.name}>{data?.name || "YOUR NAME HERE"}</Text>
                <Text style={styles.contact}>
                    {data?.email || "email@example.com"} | {data?.phone || "+92 300 1234567"} | {data?.linkedin || "linkedin.com/in/you"}
                </Text>
            </View>

            {/* EXPERIENCE SECTION */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Experience</Text>

                {/* Job 1 */}
                <View style={{ marginBottom: 8 }}>
                    <View style={styles.row}>
                        <Text style={styles.bold}>Senior Software Engineer</Text>
                        <Text>Sept 2023 - Present</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ fontStyle: 'italic' }}>Tech Company Inc.</Text>
                        <Text>Islamabad, Pakistan</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Developed scalable APIs using Python and FastAPI, handling 10k+ requests daily.</Text>
                    </View>
                    <View style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>Reduced database query time by 40% by implementing Redis caching.</Text>
                    </View>
                </View>
            </View>

            {/* EDUCATION SECTION */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={styles.row}>
                    <Text style={styles.bold}>Bachelor of Computer Science</Text>
                    <Text>2019 - 2023</Text>
                </View>
                <View style={styles.row}>
                    <Text>University of Engineering & Technology</Text>
                    <Text>Lahore, PK</Text>
                </View>
            </View>

            {/* SKILLS SECTION */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text>
                    <Text style={styles.bold}>Languages: </Text> Python, TypeScript, SQL, HTML/CSS
                </Text>
                <Text>
                    <Text style={styles.bold}>Frameworks: </Text> Next.js, FastAPI, React, Tailwind CSS
                </Text>
            </View>

        </Page>
    </Document>
);