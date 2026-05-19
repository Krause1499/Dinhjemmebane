import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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

type MysteryBox = {
  id: number;
  type: string;
  size: string;
  price: number;
  priceWithVAT: number;
  isAvailable: boolean;
  quantity: number;
};

type BoxType = {
  id: string;
  eyebrow: string;
  name: string;
  description: string;
  details: string[];
  accent?: boolean;
  tag?: string;
};

const BOX_TYPES: BoxType[] = [
  {
    id: 'spiller',
    eyebrow: 'Med tryk på ryggen',
    name: 'Spiller Box',
    description: 'Få en tilfældig spillertrøje med navn og nummer på ryggen — fra en af de store europæiske ligaer.',
    details: [
      'Tilfældig spillertrøje',
      'Med tryk på ryggen',
      'Fra kendte ligaer',
      'Gratis fragt over 499 kr.',
    ],
  },
  {
    id: 'klassisk',
    eyebrow: 'Klassisk kollektion',
    name: 'Klassisk Box',
    description: 'Vores mest populære box — en tilfældig fodboldtrøje uden tryk, fra en bred kollektion af hold og sæsoner.',
    details: [
      'Tilfældig fodboldtrøje',
      'Uden tryk',
      'Bredt udvalg af hold',
      'Gratis fragt over 499 kr.',
    ],
    accent: true,
    tag: 'Mest populær',
  },
  {
    id: 'boerne',
    eyebrow: 'Til de små fodboldstjerner',
    name: 'Børne Box',
    description: 'En overraskelse til den lille fodboldelsker — en tilfældig trøje i børnestørrelse fra vores kollektion.',
    details: [
      'Tilfældig børnetrøje',
      'Størrelser XS–M',
      'Fra kendte hold',
      'Gratis fragt over 499 kr.',
    ],
  },
];

const NUM_COLUMNS = 2;

export default function ShopScreen() {
  const { addToCart, isInCart } = useCart();

  const [shirts, setShirts] = useState<Shirt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([]);
  const [mysteryLoading, setMysteryLoading] = useState(false);
  const [mysteryLoaded, setMysteryLoaded] = useState(false);
  const [mysteryRefreshing, setMysteryRefreshing] = useState(false);

  const [activeView, setActiveView] = useState<'shirts' | 'mystery'>('shirts');
  const [activePicker, setActivePicker] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const cardWidth = (width - Spacing.lg * 2 - Spacing.md) / NUM_COLUMNS;

  const fetchShirts = async () => {
    try {
      const response = await fetch("https://api.dinhjemmebane.dk/api/shirts");
      if (!response.ok) throw new Error(`Fejl ved API-kald: ${response.status}`);
      const result: Shirt[] = await response.json();
      setShirts(result);
    } catch (error) {
      console.log("Fejl ved hentning af shirts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMysteryBoxes = async (isRefresh = false) => {
    if (isRefresh) setMysteryRefreshing(true);
    else setMysteryLoading(true);
    try {
      const response = await fetch("https://api.dinhjemmebane.dk//api/mysterybox");
      if (!response.ok) throw new Error(`Fejl ved API-kald: ${response.status}`);
      const result: MysteryBox[] = await response.json();
      setMysteryBoxes(result);
      setMysteryLoaded(true);
    } catch (error) {
      console.log("Fejl ved hentning af mystery boxes:", error);
    } finally {
      setMysteryLoading(false);
      setMysteryRefreshing(false);
    }
  };

  useEffect(() => {
    fetchShirts();
  }, []);

  const sizesForType = (typeId: string) =>
    mysteryBoxes.filter((b) => b.type === typeId);

  const priceForType = (typeId: string) => {
    const available = mysteryBoxes.filter((b) => b.type === typeId && b.isAvailable);
    if (available.length === 0) return null;
    return Math.min(...available.map((b) => b.priceWithVAT));
  };

  const handleBuy = (box: MysteryBox) => {
    if (!box.isAvailable) return;
    addToCart({
      id: box.id,
      name: `${box.type.charAt(0).toUpperCase() + box.type.slice(1)} Box`,
      size: box.size,
      price: box.priceWithVAT,
      pictureUrl: null,
      itemType: 'mysterybox',
    });
    setActivePicker(null);
  };

  const Toggle = (
    <View style={styles.toggleWrapper}>
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.toggleBtn, activeView === 'shirts' && styles.toggleActive]}
          onPress={() => {
            setActiveView('shirts');
            setActivePicker(null);
          }}
        >
          <Text style={[styles.toggleText, activeView === 'shirts' && styles.toggleTextActive]}>
            Trøjer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, activeView === 'mystery' && styles.toggleActive]}
          onPress={() => {
            setActiveView('mystery');
            if (!mysteryLoaded) fetchMysteryBoxes();
          }}
        >
          <Text style={[styles.toggleText, activeView === 'mystery' && styles.toggleTextActive]}>
            Mystery Boxes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
        <Text style={styles.loadingText}>Henter trøjer...</Text>
      </View>
    );
  }

  if (activeView === 'mystery') {
    if (mysteryLoading) {
      return (
        <View style={styles.container}>
          {Toggle}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.loadingText}>Henter mystery boxes...</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {Toggle}
        <ScrollView
          contentContainerStyle={styles.mysteryList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={mysteryRefreshing}
              onRefresh={() => fetchMysteryBoxes(true)}
              tintColor={Colors.gold}
              colors={[Colors.gold]}
            />
          }
        >
          <View style={styles.header}>
            <Text style={styles.kicker}>MYSTERY BOXES</Text>
            <Text style={styles.headerTitle}>Hvad gemmer sig indeni?</Text>
            <Text style={styles.headerSubtitle}>
              Vælg din type og størrelse — vi pakker og sender en overraskelse direkte til din dør.
            </Text>
          </View>

          {BOX_TYPES.map((box) => {
            const sizes = sizesForType(box.id);
            const price = priceForType(box.id);
            const isPickerOpen = activePicker === box.id;

            return (
              <View
                key={box.id}
                style={[styles.mysteryCard, box.accent && styles.mysteryCardAccent]}
              >
                {box.tag && (
                  <View style={styles.mysteryTag}>
                    <Text style={styles.mysteryTagText}>{box.tag}</Text>
                  </View>
                )}

                <View style={styles.mysteryImageArea}>
                  <Text style={styles.mysteryBoxEmoji}>📦</Text>
                </View>

                <View style={styles.mysteryCardContent}>
                  <Text style={[styles.mysteryEyebrow, box.accent && styles.mysteryEyebrowAccent]}>
                    {box.eyebrow}
                  </Text>
                  <Text style={[styles.mysteryName, box.accent && styles.mysteryNameAccent]}>
                    {box.name}
                  </Text>
                  <Text style={[styles.mysteryDescription, box.accent && styles.mysteryDescriptionAccent]}>
                    {box.description}
                  </Text>

                  <View style={styles.mysteryDetails}>
                    {box.details.map((detail, i) => (
                      <View key={i} style={styles.mysteryDetailRow}>
                        <Text style={[styles.mysteryDetailCheck, box.accent && styles.mysteryDetailCheckAccent]}>
                          ✓
                        </Text>
                        <Text style={[styles.mysteryDetailText, box.accent && styles.mysteryDetailTextAccent]}>
                          {detail}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.mysteryPriceRow}>
                    <Text style={[styles.mysteryPriceLabel, box.accent && styles.mysteryPriceLabelAccent]}>
                      Fra
                    </Text>
                    <Text style={[styles.mysteryPrice, box.accent && styles.mysteryPriceAccent]}>
                      {mysteryLoaded ? (price !== null ? `${price} kr.` : '—') : '…'}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.mysteryBtn, box.accent && styles.mysteryBtnAccent]}
                    onPress={() => setActivePicker(isPickerOpen ? null : box.id)}
                  >
                    <Text style={[styles.mysteryBtnText, box.accent && styles.mysteryBtnTextAccent]}>
                      {isPickerOpen ? 'Luk' : 'Læg i kurv'}
                    </Text>
                  </TouchableOpacity>

                  {isPickerOpen && (
                    <View style={styles.sizePicker}>
                      <Text style={[styles.sizePickerLabel, box.accent && styles.sizePickerLabelAccent]}>
                        Vælg størrelse
                      </Text>
                      <View style={styles.sizePills}>
                        {sizes.length === 0 ? (
                          <Text style={styles.noSizesText}>Ingen størrelser tilgængelige</Text>
                        ) : (
                          sizes.map((s) => {
                            const inCart = isInCart(s.id);
                            const soldOut = !s.isAvailable;
                            return (
                              <TouchableOpacity
                                key={s.id}
                                style={[
                                  styles.sizePill,
                                  box.accent && styles.sizePillAccent,
                                  soldOut && styles.sizePillSoldOut,
                                  inCart && styles.sizePillInCart,
                                ]}
                                onPress={() => handleBuy(s)}
                                disabled={soldOut || inCart}
                              >
                                <Text style={[
                                  styles.sizePillText,
                                  box.accent && styles.sizePillTextAccent,
                                  soldOut && styles.sizePillTextSoldOut,
                                  inCart && styles.sizePillTextInCart,
                                ]}>
                                  {s.size}
                                </Text>
                                {soldOut && (
                                  <Text style={styles.sizePillSoldOutLabel}>Udsolgt</Text>
                                )}
                                {inCart && (
                                  <Text style={styles.sizePillInCartLabel}>✓</Text>
                                )}
                              </TouchableOpacity>
                            );
                          })
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Toggle}
      <FlatList
        data={shirts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchShirts(); }}
            tintColor={Colors.gold}
            colors={[Colors.gold]}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>KOLLEKTION</Text>
            <Text style={styles.headerTitle}>Find din næste trøje</Text>
            <Text style={styles.headerSubtitle}>
              Klassiske og moderne fodboldtrøjer fra forskellige ligaer, sæsoner og størrelser.
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{shirts.length}</Text>
                <Text style={styles.statLabel}>Trøjer i alt</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {shirts.filter((s) => s.isAvailable).length}
                </Text>
                <Text style={styles.statLabel}>På lager</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && styles.cardPressed]}
            onPress={() =>
              router.push({
                pathname: "/shirts/[id]",
                params: { id: item.id.toString() },
              })
            }
          >
            {item.pictureUrl ? (
              <Image source={{ uri: item.pictureUrl }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                <Text style={styles.imagePlaceholderText}>Ingen billede</Text>
              </View>
            )}

            {!item.isAvailable && (
              <View style={styles.soldOutOverlay}>
                <Text style={styles.soldOutText}>UDSOLGT</Text>
              </View>
            )}

            <View style={styles.cardContent}>
              <Text style={styles.league}>{item.league}</Text>
              <Text style={styles.title} numberOfLines={1}>{item.team}</Text>
              <Text style={styles.season}>{item.season}</Text>

              <View style={styles.badgeRow}>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>Str. {item.size}</Text>
                </View>
                <View style={[
                  styles.infoBadge,
                  item.isAvailable ? styles.availableBadge : styles.unavailableBadge,
                ]}>
                  <Text style={[
                    styles.infoBadgeText,
                    item.isAvailable ? styles.availableText : styles.unavailableText,
                  ]}>
                    {item.isAvailable ? "På lager" : "Udsolgt"}
                  </Text>
                </View>
              </View>

              <Text style={styles.price}>{item.priceWithVAT} kr.</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
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

  toggleWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.bg,
  },

  toggle: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: 4,
  },

  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: Radius.lg,
  },

  toggleActive: {
    backgroundColor: Colors.gold,
  },

  toggleText: {
    color: Colors.muted,
    fontSize: 13,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.5,
  },

  toggleTextActive: {
    color: Colors.navyDeep,
  },

  // ─── Shirts ────────────────────────────────────────────────────────────────

  list: {
    padding: Spacing.lg,
    paddingBottom: 32,
  },

  columnWrapper: {
    gap: Spacing.md,
  },

  header: {
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },

  kicker: {
    color: Colors.gold,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 2,
    marginBottom: 8,
  },

  headerTitle: {
    color: Colors.goldLight,
    fontSize: 38,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  headerSubtitle: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 21,
    marginBottom: Spacing.lg,
  },

  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.line,
  },

  statNumber: {
    color: Colors.goldLight,
    fontSize: 28,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  statLabel: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.line,
  },

  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },

  image: {
    width: "100%",
    height: 140,
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

  soldOutOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.soldOutBg,
    borderWidth: 1,
    borderColor: Colors.soldOutBorder,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },

  soldOutText: {
    color: Colors.soldOut,
    fontSize: 10,
    fontFamily: Fonts.bodyExtraBold,
    letterSpacing: 1,
  },

  cardContent: {
    padding: Spacing.md,
  },

  league: {
    color: Colors.gold,
    fontSize: 9,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  title: {
    color: Colors.goldLight,
    fontSize: 15,
    fontFamily: Fonts.display,
    letterSpacing: 0.3,
    marginBottom: 1,
  },

  season: {
    color: Colors.muted,
    fontSize: 11,
    fontFamily: Fonts.bodySemiBold,
    marginBottom: Spacing.sm,
  },

  availableBadge: {
    backgroundColor: Colors.availableBg,
    borderColor: Colors.availableBorder,
  },

  unavailableBadge: {
    backgroundColor: Colors.soldOutBg,
    borderColor: Colors.soldOutBorder,
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
    gap: 4,
    marginBottom: Spacing.sm,
  },

  infoBadge: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },

  infoBadgeText: {
    color: Colors.goldLight,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.2,
  },

  price: {
    color: Colors.goldLight,
    fontSize: 17,
    fontFamily: Fonts.display,
    letterSpacing: 0.3,
  },

  // ─── Mystery Boxes ─────────────────────────────────────────────────────────

  mysteryList: {
    padding: Spacing.lg,
    paddingBottom: 48,
  },

  mysteryCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.line,
    marginBottom: Spacing.lg,
    overflow: "hidden",
  },

  mysteryCardAccent: {
    backgroundColor: Colors.navyBtn,
    borderColor: Colors.gold,
  },

  mysteryTag: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 1,
    backgroundColor: Colors.gold,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },

  mysteryTagText: {
    color: Colors.navyDeep,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.5,
  },

  mysteryImageArea: {
    width: "100%",
    height: 120,
    backgroundColor: Colors.bgAlt,
    justifyContent: "center",
    alignItems: "center",
  },

  mysteryBoxEmoji: {
    fontSize: 52,
  },

  mysteryCardContent: {
    padding: Spacing.lg,
  },

  mysteryEyebrow: {
    color: Colors.gold,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  mysteryEyebrowAccent: {
    color: Colors.goldLight,
  },

  mysteryName: {
    color: Colors.goldLight,
    fontSize: 32,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },

  mysteryNameAccent: {
    color: Colors.goldLight,
  },

  mysteryDescription: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 21,
    marginBottom: Spacing.lg,
  },

  mysteryDescriptionAccent: {
    color: Colors.mutedStrong,
  },

  mysteryDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  mysteryDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  mysteryDetailCheck: {
    color: Colors.gold,
    fontSize: 13,
    fontFamily: Fonts.bodyBold,
  },

  mysteryDetailCheckAccent: {
    color: Colors.goldLight,
  },

  mysteryDetailText: {
    color: Colors.muted,
    fontSize: 13,
    fontFamily: Fonts.body,
  },

  mysteryDetailTextAccent: {
    color: Colors.mutedStrong,
  },

  mysteryPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    marginBottom: Spacing.lg,
  },

  mysteryPriceLabel: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: Fonts.body,
  },

  mysteryPriceLabelAccent: {
    color: Colors.mutedStrong,
  },

  mysteryPrice: {
    color: Colors.goldLight,
    fontSize: 26,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
  },

  mysteryPriceAccent: {
    color: Colors.goldLight,
  },

  mysteryBtn: {
    backgroundColor: Colors.gold,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: "center",
  },

  mysteryBtnAccent: {
    backgroundColor: Colors.navyDeep,
    borderWidth: 1,
    borderColor: Colors.gold,
  },

  mysteryBtnText: {
    color: Colors.navyDeep,
    fontSize: 14,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.5,
  },

  mysteryBtnTextAccent: {
    color: Colors.gold,
  },

  sizePicker: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },

  sizePickerLabel: {
    color: Colors.muted,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: Spacing.md,
  },

  sizePickerLabelAccent: {
    color: Colors.mutedStrong,
  },

  sizePills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },

  sizePill: {
    borderWidth: 1,
    borderColor: Colors.lineMid,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    alignItems: "center",
    minWidth: 60,
  },

  sizePillAccent: {
    borderColor: Colors.gold,
  },

  sizePillSoldOut: {
    opacity: 0.4,
  },

  sizePillInCart: {
    backgroundColor: Colors.availableBg,
    borderColor: Colors.availableBorder,
  },

  sizePillText: {
    color: Colors.goldLight,
    fontSize: 13,
    fontFamily: Fonts.bodySemiBold,
  },

  sizePillTextAccent: {
    color: Colors.goldLight,
  },

  sizePillTextSoldOut: {
    textDecorationLine: "line-through",
  },

  sizePillTextInCart: {
    color: Colors.available,
  },

  sizePillSoldOutLabel: {
    color: Colors.soldOut,
    fontSize: 9,
    fontFamily: Fonts.bodySemiBold,
    marginTop: 2,
  },

  sizePillInCartLabel: {
    color: Colors.available,
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    marginTop: 2,
  },

  noSizesText: {
    color: Colors.muted,
    fontSize: 13,
    fontFamily: Fonts.body,
  },
});
