import Ionicons from "@expo/vector-icons/Ionicons";
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
import { useCart } from "../../context/CartContext";
import { Colors, Fonts, Radius, Spacing } from "../../theme";

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
  const { addToCart, isInCart } = useCart();

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
        <ActivityIndicator size="large" color={Colors.gold} />
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

  const inCart = isInCart(shirt.id);

  function handleAddToCart() {
    if (!shirt.isAvailable || inCart) return;
    addToCart({
      id: shirt.id,
      name: `${shirt.team} ${shirt.season}`,
      team: shirt.team,
      season: shirt.season,
      league: shirt.league,
      size: shirt.size,
      price: shirt.priceWithVAT,
      pictureUrl: shirt.pictureUrl ?? null,
    });
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `${shirt.team} ${shirt.season}`,
        }}
      />

      <View style={styles.screen}>
      <ScrollView
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
            <View style={[
              styles.statusPill,
              shirt.isAvailable ? styles.statusPillAvailable : styles.statusPillSoldOut,
            ]}>
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

      <View style={styles.cartFooter}>
        {!shirt.isAvailable ? (
          <View style={[styles.cartBtn, styles.cartBtnSoldOut]}>
            <Text style={styles.cartBtnText}>Udsolgt</Text>
          </View>
        ) : inCart ? (
          <View style={[styles.cartBtn, styles.cartBtnInCart]}>
            <Ionicons name="checkmark" size={18} color={Colors.available} />
            <Text style={[styles.cartBtnText, { color: Colors.available }]}>Lagt i kurven</Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.cartBtn, styles.cartBtnActive, pressed && { opacity: 0.85 }]}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart-outline" size={18} color={Colors.navy} />
            <Text style={styles.cartBtnText}>Læg i kurv</Text>
          </Pressable>
        )}
      </View>
      </View>

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
    backgroundColor: Colors.bg,
  },

  cartFooter: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.headerBg,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },

  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: Radius.full,
    borderWidth: 1,
  },

  cartBtnActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },

  cartBtnInCart: {
    backgroundColor: Colors.availableBg,
    borderColor: Colors.availableBorder,
  },

  cartBtnSoldOut: {
    backgroundColor: Colors.soldOutBg,
    borderColor: Colors.soldOutBorder,
  },

  cartBtnText: {
    fontSize: 15,
    fontFamily: Fonts.bodyExtraBold,
    letterSpacing: 0.3,
    color: Colors.navy,
  },

  container: {
    padding: Spacing.lg,
    paddingBottom: 32,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },

  loadingText: {
    color: Colors.text,
    marginTop: Spacing.md,
    fontSize: 16,
    fontFamily: Fonts.body,
  },

  heroCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xxl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.line,
    marginBottom: Spacing.xl,
  },

  heroImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    backgroundColor: Colors.bgAlt,
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
  },

  heroContent: {
    padding: 18,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.md,
    marginBottom: 14,
  },

  titleBlock: {
    flex: 1,
  },

  team: {
    color: Colors.goldLight,
    fontSize: 36,
    fontFamily: Fonts.display,
    letterSpacing: 1,
    marginBottom: 2,
  },

  season: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.3,
  },

  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },

  availableBadge: {
    backgroundColor: Colors.availableBg,
    borderColor: Colors.availableBorder,
  },

  unavailableBadge: {
    backgroundColor: Colors.soldOutBg,
    borderColor: Colors.soldOutBorder,
  },

  availabilityText: {
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },

  availableText: {
    color: Colors.available,
  },

  unavailableText: {
    color: Colors.soldOut,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: 18,
  },

  infoBadge: {
    backgroundColor: Colors.bgAlt,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },

  infoBadgeText: {
    color: Colors.goldLight,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.5,
  },

  priceBox: {
    backgroundColor: Colors.bg,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.line,
  },

  priceLabel: {
    color: Colors.muted,
    fontSize: 11,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  price: {
    color: Colors.goldLight,
    fontSize: 42,
    fontFamily: Fonts.display,
    letterSpacing: 1,
  },

  section: {
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    color: Colors.goldLight,
    fontSize: 28,
    fontFamily: Fonts.display,
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },

  detailsCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.line,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  detailLabel: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
    flex: 1,
  },

  detailValue: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
    flexShrink: 1,
    textAlign: "right",
  },

  detailValueStrong: {
    color: Colors.gold,
    fontSize: 16,
    fontFamily: Fonts.bodyExtraBold,
    flexShrink: 1,
    textAlign: "right",
  },

  statusCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.line,
  },

  statusPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
    marginBottom: 12,
  },

  statusPillAvailable: {
    backgroundColor: Colors.availableBg,
    borderWidth: 1,
    borderColor: Colors.availableBorder,
  },

  statusPillSoldOut: {
    backgroundColor: Colors.soldOutBg,
    borderWidth: 1,
    borderColor: Colors.soldOutBorder,
  },

  statusPillText: {
    color: Colors.goldLight,
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },

  statusText: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 22,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.94)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
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
    borderRadius: Radius.full,
  },

  closeHintText: {
    color: Colors.text,
    fontSize: 13,
    fontFamily: Fonts.bodySemiBold,
  },
});
