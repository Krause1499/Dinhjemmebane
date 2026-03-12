import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

type Shirt = {
  id: number;
  league: string;
  team: string;
  season: string;
  quality: string;
  size: string;
  hasSleeves: boolean;
  isPrinted: boolean;
  printedName?: string | null;
  price: number;
  priceWithVAT: number;
  pictureUrl?: string | null;
  isAvailable: boolean;
  images: unknown[];
};

export default function ShirtDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [shirt, setShirt] = useState<Shirt | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageOpen, setImageOpen] = useState(false);

  const getShirt = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `https://dinhjemmebaneapi.runasp.net/api/shirts/${id}`
      );

      if (!response.ok) {
        throw new Error(`Fejl ved API-kald: ${response.status}`);
      }

      const result: Shirt = await response.json();
      setShirt(result);
    } catch (error) {
      console.log("Fejl ved hentning af shirt:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getShirt();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text style={styles.loadingText}>Henter trøje...</Text>
      </View>
    );
  }

  if (!shirt) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Kunne ikke finde trøjen.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `${shirt.team} ${shirt.season}`,
        }}
      />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          {shirt.pictureUrl ? (
            <Pressable onPress={() => setImageOpen(true)}>
              <Image source={{ uri: shirt.pictureUrl }} style={styles.heroImage} />
            </Pressable>
          ) : (
            <View style={[styles.heroImage, styles.imagePlaceholder]}>
              <Text style={styles.imagePlaceholderText}>Ingen billede</Text>
            </View>
          )}

          <View style={styles.heroContent}>
            <View style={styles.titleRow}>
              <View style={styles.titleBlock}>
                <Text style={styles.team}>{shirt.team}</Text>
                <Text style={styles.season}>{shirt.season}</Text>
              </View>

              <View
                style={[
                  styles.availabilityBadge,
                  shirt.isAvailable ? styles.availableBadge : styles.unavailableBadge,
                ]}
              >
                <Text
                  style={[
                    styles.availabilityText,
                    shirt.isAvailable ? styles.availableText : styles.unavailableText,
                  ]}
                >
                  {shirt.isAvailable ? "På lager" : "Udsolgt"}
                </Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{shirt.league}</Text>
              </View>

              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>Str. {shirt.size}</Text>
              </View>

              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>{shirt.quality}</Text>
              </View>
            </View>

            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Pris inkl. moms</Text>
              <Text style={styles.price}>{shirt.priceWithVAT} kr.</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detaljer</Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Liga</Text>
              <Text style={styles.detailValue}>{shirt.league}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hold</Text>
              <Text style={styles.detailValue}>{shirt.team}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Sæson</Text>
              <Text style={styles.detailValue}>{shirt.season}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kvalitet</Text>
              <Text style={styles.detailValue}>{shirt.quality}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Størrelse</Text>
              <Text style={styles.detailValue}>{shirt.size}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Med ærmer</Text>
              <Text style={styles.detailValue}>{shirt.hasSleeves ? "Ja" : "Nej"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tryk på trøjen</Text>
              <Text style={styles.detailValue}>{shirt.isPrinted ? "Ja" : "Nej"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Trykt navn</Text>
              <Text style={styles.detailValue}>{shirt.printedName || "Intet"}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pris ekskl. moms</Text>
              <Text style={styles.detailValue}>{shirt.price} kr.</Text>
            </View>

            <View style={[styles.detailRow, styles.lastRow]}>
              <Text style={styles.detailLabel}>Pris inkl. moms</Text>
              <Text style={styles.detailValueStrong}>{shirt.priceWithVAT} kr.</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>

          <View style={styles.statusCard}>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>
                {shirt.isAvailable ? "Klar til køb" : "Midlertidigt utilgængelig"}
              </Text>
            </View>

            <Text style={styles.statusText}>
              {shirt.isAvailable
                ? "Denne trøje er tilgængelig lige nu og kan vises videre i din app."
                : "Denne trøje er ikke tilgængelig lige nu, men data vises stadig i oversigten."}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={imageOpen} transparent animationType="fade">
        <Pressable style={styles.modalContainer} onPress={() => setImageOpen(false)}>
          {shirt.pictureUrl ? (
            <Image source={{ uri: shirt.pictureUrl }} style={styles.fullImage} />
          ) : null}

          <View style={styles.closeHint}>
            <Text style={styles.closeHintText}>Tryk hvor som helst for at lukke</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  container: {
    padding: 16,
    paddingBottom: 32,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  loadingText: {
    color: "#e5e7eb",
    marginTop: 12,
    fontSize: 16,
  },

  heroCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 20,
  },

  heroImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: "#0b1220",
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    color: "#64748b",
    fontSize: 14,
  },

  heroContent: {
    padding: 18,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },

  titleBlock: {
    flex: 1,
  },

  team: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },

  season: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "600",
  },

  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },

  availableBadge: {
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: "rgba(34,197,94,0.35)",
  },

  unavailableBadge: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderColor: "rgba(239,68,68,0.35)",
  },

  availabilityText: {
    fontSize: 12,
    fontWeight: "700",
  },

  availableText: {
    color: "#4ade80",
  },

  unavailableText: {
    color: "#f87171",
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18,
  },

  infoBadge: {
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },

  infoBadgeText: {
    color: "#e2e8f0",
    fontSize: 12,
    fontWeight: "700",
  },

  priceBox: {
    backgroundColor: "#0b1220",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },

  priceLabel: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 6,
  },

  price: {
    color: "#f8fafc",
    fontSize: 30,
    fontWeight: "800",
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },

  detailsCard: {
    backgroundColor: "#111827",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  detailLabel: {
    color: "#94a3b8",
    fontSize: 15,
    flex: 1,
  },

  detailValue: {
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },

  detailValueStrong: {
    color: "#fbbf24",
    fontSize: 17,
    fontWeight: "800",
    flexShrink: 1,
    textAlign: "right",
  },

  statusCard: {
    backgroundColor: "#111827",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1f2937",
  },

  statusPill: {
    alignSelf: "flex-start",
    backgroundColor: "#1d4ed8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 12,
  },

  statusPillText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },

  statusText: {
    color: "#cbd5e1",
    fontSize: 15,
    lineHeight: 22,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.94)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  fullImage: {
    width: "100%",
    height: "75%",
    resizeMode: "contain",
  },

  closeHint: {
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
  },

  closeHintText: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: "600",
  },
});