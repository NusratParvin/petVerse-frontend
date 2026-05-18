// src/components/ImportWizard/HealthPassportPDF.tsx
// npm install @react-pdf/renderer
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { TVet } from "@/src/types";
import { ParsedHealthRecord } from "@/src/redux/features/importWizard/importWizardApi";

const TYPE_LABELS: Record<string, string> = {
  vaccine: "Vaccine",
  "vet-visit": "Vet Visit",
  medication: "Medication",
  grooming: "Grooming",
  other: "Other",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#4682B4",
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  subtitle: {
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },
  petInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 6,
  },
  petInfoItem: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: "#1a1a2e",
    fontFamily: "Helvetica-Bold",
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#4682B4",
    marginBottom: 8,
    marginTop: 4,
  },
  record: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#4682B4",
  },
  recordHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  recordTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  typeBadge: {
    fontSize: 9,
    color: "#4682B4",
    backgroundColor: "#e8f0f9",
    padding: "2 6",
    borderRadius: 3,
  },
  recordMeta: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
  },
  metaText: {
    fontSize: 10,
    color: "#555",
  },
  notes: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 9,
    color: "#aaa",
  },
});

interface HealthPassportDocProps {
  petName: string;
  species: string;
  breed?: string;
  records: ParsedHealthRecord[];
  generatedAt: string;
}

const HealthPassportDoc = ({
  petName,
  species,
  breed,
  records,
  generatedAt,
}: HealthPassportDocProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🐾 Health Passport</Text>
        <Text style={styles.subtitle}>
          PetVerse UAE — Generated {generatedAt}
        </Text>
      </View>

      {/* Pet Info */}
      <View style={styles.petInfo}>
        <View style={styles.petInfoItem}>
          <Text style={styles.label}>Pet Name</Text>
          <Text style={styles.value}>{petName}</Text>
        </View>
        <View style={styles.petInfoItem}>
          <Text style={styles.label}>Species</Text>
          <Text style={styles.value}>{species}</Text>
        </View>
        {breed && (
          <View style={styles.petInfoItem}>
            <Text style={styles.label}>Breed</Text>
            <Text style={styles.value}>{breed}</Text>
          </View>
        )}
        <View style={styles.petInfoItem}>
          <Text style={styles.label}>Total Records</Text>
          <Text style={styles.value}>{records.length}</Text>
        </View>
      </View>

      {/* Records */}
      <Text style={styles.sectionTitle}>Health Records</Text>
      {records.map((r, i) => (
        <View key={i} style={styles.record}>
          <View style={styles.recordHeader}>
            <Text style={styles.recordTitle}>{r.title}</Text>
            <Text style={styles.typeBadge}>{TYPE_LABELS[r.type]}</Text>
          </View>
          <View style={styles.recordMeta}>
            <Text style={styles.metaText}>Date: {r.date}</Text>
            {r.nextDueDate && (
              <Text style={styles.metaText}>Next due: {r.nextDueDate}</Text>
            )}
            {r.vetName && <Text style={styles.metaText}>Vet: {r.vetName}</Text>}
            {r.cost && <Text style={styles.metaText}>Cost: AED {r.cost}</Text>}
          </View>
          {r.notes && <Text style={styles.notes}>{r.notes}</Text>}
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer} fixed>
        <Text style={styles.footerText}>PetVerse UAE Health Passport</Text>
        <Text style={styles.footerText}>
          {petName} · {generatedAt}
        </Text>
      </View>
    </Page>
  </Document>
);

// Call this to trigger browser download
export const downloadHealthPassport = async (
  petName: string,
  species: string,
  breed: string | undefined,
  records: ParsedHealthRecord[],
) => {
  const generatedAt = new Date().toLocaleDateString("en-AE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const blob = await pdf(
    <HealthPassportDoc
      petName={petName}
      species={species}
      breed={breed}
      records={records}
      generatedAt={generatedAt}
    />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${petName}-health-passport.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};
