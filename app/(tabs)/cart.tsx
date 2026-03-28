import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCart, type CartItem } from "../../context/CartContext";
import { Colors, Fonts, Radius, Spacing } from "../../theme";

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_COST = 49;
const API = "https://dinhjemmebaneapi.runasp.net/api";

export default function CartScreen() {
  const { items, itemCount, total, removeFromCart, clearCart } = useCart();
  const [unavailableIds, setUnavailableIds] = useState<Set<number>>(new Set());
  const abortRef = useRef<AbortController | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (items.length === 0) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      Promise.all(
        items.map((item) => {
          const endpoint = item.itemType === 'mysterybox'
            ? `${API}/mysterybox/${item.id}`
            : `${API}/shirts/${item.id}`;
          return fetch(endpoint, { signal: controller.signal })
            .then((r) => r.json())
            .then((data) => ({ id: item.id, isAvailable: data.isAvailable as boolean }))
            .catch(() => null);
        })
      ).then((results) => {
        const ids = new Set<number>();
        for (const r of results) {
          if (r && !r.isAvailable) ids.add(r.id);
        }
        setUnavailableIds(ids);
      });

      return () => controller.abort();
    }, [items])
  );

  const hasUnavailable = unavailableIds.size > 0;
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const orderTotal = total + shipping;
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  function handleRemove(item: CartItem) {
    const label = item.itemType === 'mysterybox' ? item.name : `${item.team} ${item.season}`;
    Alert.alert(
      "Fjern fra kurv",
      `Vil du fjerne "${label}" fra kurven?`,
      [
        { text: "Annuller", style: "cancel" },
        { text: "Fjern", style: "destructive", onPress: () => removeFromCart(item.id) },
      ]
    );
  }

  function handleClearCart() {
    Alert.alert("Tøm kurv", "Er du sikker på, at du vil fjerne alle varer?", [
      { text: "Annuller", style: "cancel" },
      { text: "Tøm kurv", style: "destructive", onPress: clearCart },
    ]);
  }

  if (itemCount === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={72} color={Colors.muted} />
        <Text style={styles.emptyTitle}>Din kurv er tom</Text>
        <Text style={styles.emptySubtitle}>
          Find en trøje og læg den i kurven for at komme i gang.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.shopBtn, pressed && { opacity: 0.8 }]}
          onPress={() => router.push("/(tabs)/shop")}
        >
          <Text style={styles.shopBtnText}>Se trøjer</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      style={styles.flatList}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Din kurv</Text>
            <Pressable onPress={handleClearCart} hitSlop={8}>
              <Text style={styles.clearText}>Tøm kurv</Text>
            </Pressable>
          </View>
          <Text style={styles.headerSub}>
            {itemCount} {itemCount === 1 ? "vare" : "varer"}
          </Text>

          {remaining > 0 && (
            <View style={styles.shippingBar}>
              <View style={styles.shippingBarTrack}>
                <View
                  style={[
                    styles.shippingBarFill,
                    { width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.shippingBarText}>
                Køb for{" "}
                <Text style={styles.shippingBarAmount}>{remaining} kr.</Text>{" "}
                mere og få gratis fragt
              </Text>
            </View>
          )}

          {remaining <= 0 && (
            <View style={styles.freeShippingBadge}>
              <Ionicons name="checkmark-circle" size={14} color={Colors.available} />
              <Text style={styles.freeShippingText}>Du har optjent gratis fragt!</Text>
            </View>
          )}
        </View>
      }
      renderItem={({ item }) => {
        const unavailable = unavailableIds.has(item.id);
        return (
          <View style={[styles.card, unavailable && styles.cardUnavailable]}>
            {item.pictureUrl ? (
              <Image
                source={{ uri: item.pictureUrl }}
                style={[styles.image, unavailable && styles.imageUnavailable]}
              />
            ) : (
              <View style={[styles.image, styles.imagePlaceholder]}>
                {item.itemType === 'mysterybox'
                  ? <Text style={{ fontSize: 32 }}>📦</Text>
                  : <Ionicons name="shirt-outline" size={28} color={Colors.muted} />
                }
              </View>
            )}

            <View style={styles.cardContent}>
              {unavailable && (
                <View style={styles.unavailableBanner}>
                  <Ionicons name="warning-outline" size={12} color={Colors.soldOut} />
                  <Text style={styles.unavailableBannerText}>Ikke længere tilgængelig</Text>
                </View>
              )}

              <View style={styles.cardTop}>
                <View style={styles.cardInfo}>
                  {item.itemType === 'mysterybox' ? (
                    <>
                      <Text style={styles.cardLeague}>MYSTERY BOX</Text>
                      <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.cardLeague}>{item.league}</Text>
                      <Text style={styles.cardName} numberOfLines={1}>{item.team}</Text>
                      <Text style={styles.cardSeason}>{item.season}</Text>
                    </>
                  )}
                </View>

                <Pressable
                  onPress={() => handleRemove(item)}
                  hitSlop={8}
                  style={({ pressed }) => [styles.removeBtn, pressed && { opacity: 0.6 }]}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.soldOut} />
                </Pressable>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.sizeBadge}>
                  <Text style={styles.sizeBadgeText}>Str. {item.size}</Text>
                </View>
                <Text style={styles.cardPrice}>{item.price} kr.</Text>
              </View>
            </View>
          </View>
        );
      }}
      ListFooterComponent={
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Ordresammendrag</Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{total} kr.</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fragt</Text>
              <Text style={[styles.summaryValue, shipping === 0 && styles.freeShippingValue]}>
                {shipping === 0 ? "Gratis" : `${SHIPPING_COST} kr.`}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total inkl. moms</Text>
              <Text style={styles.totalValue}>{orderTotal} kr.</Text>
            </View>
          </View>

          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Ionicons name="lock-closed-outline" size={14} color={Colors.muted} />
              <Text style={styles.trustText}>Sikker betaling</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="refresh-outline" size={14} color={Colors.muted} />
              <Text style={styles.trustText}>30 dages retur</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="bicycle-outline" size={14} color={Colors.muted} />
              <Text style={styles.trustText}>2–5 hverdage</Text>
            </View>
          </View>

          {hasUnavailable && (
            <View style={styles.unavailableWarning}>
              <Ionicons name="warning-outline" size={16} color={Colors.soldOut} />
              <Text style={styles.unavailableWarningText}>
                En eller flere varer er ikke længere tilgængelige. Fjern dem for at fortsætte.
              </Text>
            </View>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.checkoutBtn,
              hasUnavailable && styles.checkoutBtnDisabled,
              !hasUnavailable && pressed && { opacity: 0.85 },
            ]}
            onPress={() => {
              if (hasUnavailable) return;
              router.push("/checkout");
            }}
          >
            <Text style={styles.checkoutBtnText}>Gå til betaling →</Text>
          </Pressable>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  list: {
    padding: Spacing.lg,
    paddingBottom: 40,
    backgroundColor: Colors.bg,
  },

  // ─── Tom kurv ──────────────────────────────────────────────────────────────

  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xxl,
  },

  emptyTitle: {
    color: Colors.goldLight,
    fontSize: 26,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  emptySubtitle: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },

  shopBtn: {
    backgroundColor: Colors.navyBtn,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: Radius.full,
  },

  shopBtnText: {
    color: Colors.goldLight,
    fontSize: 14,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },

  // ─── Header ────────────────────────────────────────────────────────────────

  header: {
    marginBottom: Spacing.lg,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 4,
  },

  headerTitle: {
    color: Colors.goldLight,
    fontSize: 38,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
  },

  clearText: {
    color: Colors.soldOut,
    fontSize: 12,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.3,
    paddingBottom: 6,
  },

  headerSub: {
    color: Colors.muted,
    fontSize: 13,
    fontFamily: Fonts.body,
    marginBottom: Spacing.md,
  },

  shippingBar: {
    marginTop: Spacing.sm,
  },

  shippingBarTrack: {
    height: 4,
    backgroundColor: Colors.line,
    borderRadius: Radius.full,
    overflow: "hidden",
    marginBottom: 8,
  },

  shippingBarFill: {
    height: "100%",
    backgroundColor: Colors.gold,
    borderRadius: Radius.full,
  },

  shippingBarText: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: Fonts.body,
  },

  shippingBarAmount: {
    color: Colors.gold,
    fontFamily: Fonts.bodyBold,
  },

  freeShippingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.sm,
    backgroundColor: Colors.availableBg,
    borderWidth: 1,
    borderColor: Colors.availableBorder,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },

  freeShippingText: {
    color: Colors.available,
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
  },

  // ─── Kurv-kort ─────────────────────────────────────────────────────────────

  card: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.line,
  },

  cardUnavailable: {
    borderColor: Colors.soldOutBorder,
    backgroundColor: Colors.soldOutBg,
  },

  imageUnavailable: {
    opacity: 0.4,
  },

  unavailableBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.soldOutBg,
    borderWidth: 1,
    borderColor: Colors.soldOutBorder,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    marginBottom: Spacing.sm,
    alignSelf: "flex-start",
  },

  unavailableBannerText: {
    color: Colors.soldOut,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },

  image: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    backgroundColor: Colors.bgAlt,
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  cardContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "space-between",
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  cardInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },

  cardLeague: {
    color: Colors.gold,
    fontSize: 9,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },

  cardName: {
    color: Colors.goldLight,
    fontSize: 16,
    fontFamily: Fonts.display,
    letterSpacing: 0.3,
  },

  cardSeason: {
    color: Colors.muted,
    fontSize: 11,
    fontFamily: Fonts.bodySemiBold,
  },

  removeBtn: {
    padding: 4,
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.sm,
  },

  sizeBadge: {
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },

  sizeBadgeText: {
    color: Colors.goldLight,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.2,
  },

  cardPrice: {
    color: Colors.goldLight,
    fontSize: 17,
    fontFamily: Fonts.display,
    letterSpacing: 0.3,
  },

  // ─── Ordresammendrag ───────────────────────────────────────────────────────

  summary: {
    marginTop: Spacing.lg,
  },

  summaryTitle: {
    color: Colors.goldLight,
    fontSize: 28,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },

  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.line,
    marginBottom: Spacing.md,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  summaryLabel: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
  },

  summaryValue: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
  },

  freeShippingValue: {
    color: Colors.available,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.line,
    marginVertical: 4,
  },

  totalLabel: {
    color: Colors.goldLight,
    fontSize: 15,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },

  totalValue: {
    color: Colors.gold,
    fontSize: 22,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
  },

  trustRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  trustText: {
    color: Colors.muted,
    fontSize: 11,
    fontFamily: Fonts.body,
  },

  unavailableWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.soldOutBg,
    borderWidth: 1,
    borderColor: Colors.soldOutBorder,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
  },

  unavailableWarningText: {
    color: Colors.soldOut,
    fontSize: 13,
    fontFamily: Fonts.body,
    flex: 1,
    lineHeight: 19,
  },

  checkoutBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: Radius.full,
    alignItems: "center",
  },

  checkoutBtnDisabled: {
    backgroundColor: Colors.lineMid,
  },

  checkoutBtnText: {
    color: Colors.navy,
    fontSize: 15,
    fontFamily: Fonts.bodyExtraBold,
    letterSpacing: 0.5,
  },
});
