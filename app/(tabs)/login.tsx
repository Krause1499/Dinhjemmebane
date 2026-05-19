import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Colors, Fonts, Radius, Spacing } from "../../theme";

const API = "https://api.dinhjemmebane.dk/api";

// ─── Typer ───────────────────────────────────────────────────────────────────

type OrderItem = {
  shirt?: { team: string; season: string; size: string };
  mysteryBox?: { type: string; size: string };
};

type Order = {
  id: number;
  referenceId: string;
  orderDate: string;
  status: 1 | 2 | 3;
  orderHandle: string;
  orderItems: OrderItem[];
  priceWithVAT: number;
};

// ─── Hjælpefunktioner ────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function itemLabel(item: OrderItem): string {
  if (item.shirt) {
    const s = item.shirt;
    return `${s.team} ${s.season} · Str. ${s.size}`;
  }
  if (item.mysteryBox) {
    return `Mystery Box — ${item.mysteryBox.type} (${item.mysteryBox.size})`;
  }
  return "Vare";
}

const STATUS_CONFIG: Record<number, { label: string; color: string; bg: string; border: string }> = {
  1: { label: "Betaling modtaget", color: Colors.gold,      bg: Colors.goldDim,      border: "rgba(201,168,75,0.3)" },
  2: { label: "Afsendt",           color: Colors.available, bg: Colors.availableBg,  border: Colors.availableBorder },
  3: { label: "Afsluttet",         color: Colors.goldLight, bg: Colors.card,         border: Colors.line },
};

// ─── Min Konto ───────────────────────────────────────────────────────────────

function MinKontoScreen() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [tfaLoading, setTfaLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  useEffect(() => {
    fetch(`${API}/orders/my`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => { setOrders(data); setOrdersLoading(false); })
      .catch(() => setOrdersLoading(false));

    fetch(`${API}/securewebsite/2fa-status`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setTwoFactorEnabled(data.twoFactorEnabled); })
      .catch(() => {});
  }, []);

  async function handleToggle2FA() {
    setTfaLoading(true);
    try {
      const res = await fetch(`${API}/securewebsite/toggle-2fa`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setTwoFactorEnabled(data.twoFactorEnabled);
      }
    } finally {
      setTfaLoading(false);
    }
  }

  async function handleLogout() {
    setLogoutLoading(true);
    await logout();
    setLogoutLoading(false);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.accountContainer} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.accountHeader}>
        <View>
          <Text style={styles.accountTitle}>Min konto</Text>
          <Text style={styles.accountEmail}>{user?.email}</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.7 }]}
          onPress={handleLogout}
          disabled={logoutLoading}
        >
          {logoutLoading
            ? <ActivityIndicator size="small" color={Colors.soldOut} />
            : <>
                <Ionicons name="log-out-outline" size={16} color={Colors.soldOut} />
                <Text style={styles.logoutText}>Log ud</Text>
              </>
          }
        </Pressable>
      </View>

      {/* Ordrer */}
      <Text style={styles.sectionLabel}>
        {ordersLoading ? "Henter ordrer…" : `${orders.length} ordre${orders.length !== 1 ? "r" : ""}`}
      </Text>

      {ordersLoading && (
        <>
          <OrderSkeleton />
          <OrderSkeleton />
        </>
      )}

      {!ordersLoading && orders.length === 0 && (
        <View style={styles.emptyBox}>
          <Ionicons name="bag-outline" size={36} color={Colors.muted} />
          <Text style={styles.emptyTitle}>Ingen ordrer endnu</Text>
          <Text style={styles.emptyText}>
            Du har ikke lagt nogen ordrer ind. Find din næste trøje herunder.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.emptyBtn, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/shop")}
          >
            <Text style={styles.emptyBtnText}>Se trøjer →</Text>
          </Pressable>
        </View>
      )}

      {!ordersLoading && orders.map((order) => {
        const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG[3];
        const preview = order.orderItems?.slice(0, 2) ?? [];
        const extra = (order.orderItems?.length ?? 0) - preview.length;

        return (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderCardTop}>
              <View>
                <Text style={styles.orderRef}>#{order.referenceId}</Text>
                <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                <View style={[styles.statusDot, { backgroundColor: cfg.color }]} />
                <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
            </View>

            <View style={styles.orderCardBody}>
              <View style={styles.orderItems}>
                {preview.map((item, i) => (
                  <Text key={i} style={styles.orderItemLine}>{itemLabel(item)}</Text>
                ))}
                {extra > 0 && (
                  <Text style={styles.orderItemMore}>+ {extra} vare{extra > 1 ? "r" : ""} mere</Text>
                )}
              </View>
              <Text style={styles.orderTotal}>
                {order.priceWithVAT?.toLocaleString("da-DK", { maximumFractionDigits: 0 })} kr.
              </Text>
            </View>
          </View>
        );
      })}

      {/* Sikkerhed */}
      <Text style={[styles.sectionLabel, { marginTop: 32 }]}>Sikkerhed</Text>
      <View style={styles.securityCard}>
        <View style={styles.securityIcon}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.gold} />
        </View>
        <View style={styles.securityBody}>
          <View style={styles.securityTitleRow}>
            <Text style={styles.securityTitle}>To-faktor godkendelse</Text>
            <View style={[
              styles.tfaBadge,
              twoFactorEnabled ? styles.tfaBadgeOn : styles.tfaBadgeOff,
            ]}>
              <View style={[styles.tfaDot, { backgroundColor: twoFactorEnabled ? Colors.available : Colors.muted }]} />
              <Text style={[styles.tfaLabel, { color: twoFactorEnabled ? Colors.available : Colors.muted }]}>
                {twoFactorEnabled ? "Aktiv" : "Ikke aktiv"}
              </Text>
            </View>
          </View>
          <Text style={styles.securitySub}>
            {twoFactorEnabled
              ? "Dit login bekræftes med en kode sendt til din email."
              : "Dit login kræver kun adgangskode."}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.tfaToggleBtn,
            twoFactorEnabled ? styles.tfaToggleOn : styles.tfaToggleOff,
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleToggle2FA}
          disabled={tfaLoading}
        >
          {tfaLoading
            ? <ActivityIndicator size="small" color={Colors.goldLight} />
            : <Text style={styles.tfaToggleText}>{twoFactorEnabled ? "Slå fra" : "Slå til"}</Text>
          }
        </Pressable>
      </View>

    </ScrollView>
  );
}

function OrderSkeleton() {
  return (
    <View style={[styles.orderCard, styles.skeletonCard]}>
      <View style={styles.skeletonLine} />
      <View style={[styles.skeletonLine, { width: "60%", marginTop: 8 }]} />
    </View>
  );
}

// ─── Login/OTP skærme ────────────────────────────────────────────────────────

export default function AccountTab() {
  const { user, loading, login, verifyOtp, resendConfirmation } = useAuth();

  // Login-trin
  const [step, setStep] = useState<"password" | "otp">("password");
  const [otpToken, setOtpToken] = useState("");
  const otpRef = useRef<TextInput>(null);

  // Formfelter
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  // UI-tilstand
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendStatus, setResendStatus] = useState("");

  // Nedtæller for gensend
  function startCountdown(seconds: number) {
    setResendCountdown(seconds);
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleLogin() {
    if (!email || !password) { setError("Udfyld både email og adgangskode."); return; }
    setError(""); setSuccessMsg(""); setNeedsConfirmation(false);
    setSubmitting(true);

    const result = await login(email, password, remember);
    setSubmitting(false);

    if ("ok" in result) return; // Logget ind — state opdateres via context

    if ("otp" in result) {
      setOtpToken(result.otpToken);
      setStep("otp");
      setTimeout(() => otpRef.current?.focus(), 300);
      return;
    }

    if ("needsConfirmation" in result) {
      setNeedsConfirmation(true);
      setResendEmail(result.email);
      setError("Din email er ikke bekræftet.");
      return;
    }

    setError(result.error);
  }

  async function handleOtp() {
    if (!otpCode) { setError("Indtast sikkerhedskoden."); return; }
    setError(""); setSubmitting(true);

    const result = await verifyOtp(otpToken, otpCode);
    setSubmitting(false);

    if ("ok" in result) return;

    if ("tooManyAttempts" in result) {
      setStep("password");
      setOtpToken("");
      setOtpCode("");
      setError("For mange forkerte forsøg. Prøv at logge ind igen.");
      return;
    }

    setError(result.error);
  }

  async function handleResend() {
    const result = await resendConfirmation(resendEmail);
    if ("cooldown" in result) { startCountdown(result.cooldown); return; }
    if ("ok" in result) { setResendStatus("Et nyt bekræftelseslink er sendt."); startCountdown(120); }
  }

  // Mens AsyncStorage loader
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  // Logget ind → vis min konto
  if (user) return <MinKontoScreen />;

  // ─── Login-formular ───────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <StatusBar barStyle="light-content" />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.page}>

          {/* Panel */}
          <View style={styles.panel}>
            <Text style={styles.panelHeading}>
              {step === "password" ? "Log ind på din konto" : "Bekræft din identitet"}
            </Text>
            <Text style={styles.panelSub}>
              {step === "password"
                ? "Få adgang til din ordrehistorik og en hurtigere checkout."
                : "Vi har sendt en engangskode til din email."}
            </Text>
            <View style={styles.perks}>
              {["Se alle dine ordrer samlet", "Hurtigere checkout næste gang", "Sikker og krypteret forbindelse"].map((p) => (
                <View key={p} style={styles.perkItem}>
                  <View style={styles.perkDot} />
                  <Text style={styles.perkText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>

            {step === "password" ? (
              <>
                <Text style={styles.formTitle}>Velkommen tilbage</Text>
                <Text style={styles.formSub}>Log ind for at fortsætte</Text>

                {!!error && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                    {needsConfirmation && (
                      <Pressable
                        onPress={handleResend}
                        disabled={resendCountdown > 0}
                        style={{ marginTop: 8 }}
                      >
                        <Text style={styles.resendLink}>
                          {resendCountdown > 0
                            ? `Gensend om ${resendCountdown}s`
                            : "Gensend bekræftelsesemail"}
                        </Text>
                      </Pressable>
                    )}
                    {!!resendStatus && <Text style={styles.resendSuccess}>{resendStatus}</Text>}
                  </View>
                )}

                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="din@email.dk"
                    placeholderTextColor={Colors.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    style={styles.input}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Adgangskode</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Indtast din adgangskode"
                    placeholderTextColor={Colors.muted}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    style={styles.input}
                  />
                </View>

                <View style={styles.rememberRow}>
                  <Text style={styles.rememberText}>Husk mig</Text>
                  <Switch
                    value={remember}
                    onValueChange={setRemember}
                    trackColor={{ false: Colors.bgAlt, true: Colors.navyBtn }}
                    thumbColor={remember ? Colors.gold : Colors.muted}
                  />
                </View>

                <Pressable
                  style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }, submitting && styles.submitBtnDisabled]}
                  onPress={handleLogin}
                  disabled={submitting}
                >
                  {submitting
                    ? <ActivityIndicator color={Colors.goldLight} />
                    : <Text style={styles.submitBtnText}>Log ind</Text>
                  }
                </Pressable>

                <Text style={styles.footer}>
                  Har du ikke en konto?{" "}
                  <Text style={styles.footerLink} onPress={() => router.push("/register")}>
                    Opret konto
                  </Text>
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.formTitle}>Bekræft</Text>
                <Text style={styles.formSub}>Vi har sendt en 6-cifret kode til din email.</Text>

                {!!error && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                <View style={styles.field}>
                  <Text style={styles.label}>Sikkerhedskode</Text>
                  <TextInput
                    ref={otpRef}
                    value={otpCode}
                    onChangeText={setOtpCode}
                    placeholder="6-cifret kode"
                    placeholderTextColor={Colors.muted}
                    keyboardType="number-pad"
                    maxLength={6}
                    returnKeyType="done"
                    onSubmitEditing={handleOtp}
                    style={[styles.input, styles.otpInput]}
                  />
                  <Text style={styles.otpHint}>Tjek evt. din spam-mappe</Text>
                </View>

                <Pressable
                  style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }, submitting && styles.submitBtnDisabled]}
                  onPress={handleOtp}
                  disabled={submitting}
                >
                  {submitting
                    ? <ActivityIndicator color={Colors.goldLight} />
                    : <Text style={styles.submitBtnText}>Bekræft kode</Text>
                  }
                </Pressable>

                <Pressable
                  style={{ alignItems: "center", marginTop: Spacing.md }}
                  onPress={() => { setStep("password"); setOtpToken(""); setOtpCode(""); setError(""); }}
                >
                  <Text style={styles.backLink}>← Tilbage til login</Text>
                </Pressable>
              </>
            )}

          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },

  // Min konto
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  accountContainer: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },

  accountHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },

  accountTitle: {
    color: Colors.goldLight,
    fontSize: 38,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  accountEmail: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.soldOutBg,
    borderWidth: 1,
    borderColor: Colors.soldOutBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
  },

  logoutText: {
    color: Colors.soldOut,
    fontSize: 13,
    fontFamily: Fonts.bodyBold,
  },

  sectionLabel: {
    color: Colors.muted,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: Spacing.md,
  },

  orderCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },

  orderCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    marginBottom: Spacing.md,
  },

  orderRef: {
    color: Colors.goldLight,
    fontSize: 15,
    fontFamily: Fonts.bodyBold,
    marginBottom: 4,
  },

  orderDate: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: Fonts.body,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },

  statusLabel: {
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
  },

  orderCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  orderItems: {
    flex: 1,
    gap: 4,
  },

  orderItemLine: {
    color: Colors.mutedStrong,
    fontSize: 13,
    fontFamily: Fonts.body,
  },

  orderItemMore: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: Fonts.body,
  },

  orderTotal: {
    color: Colors.goldLight,
    fontSize: 20,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginLeft: Spacing.md,
  },

  skeletonCard: {
    opacity: 0.5,
  },

  skeletonLine: {
    height: 14,
    width: "80%",
    backgroundColor: Colors.bgAlt,
    borderRadius: Radius.sm,
  },

  emptyBox: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.xxl,
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },

  emptyTitle: {
    color: Colors.text,
    fontSize: 18,
    fontFamily: Fonts.bodyBold,
  },

  emptyText: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
    textAlign: "center",
    lineHeight: 21,
  },

  emptyBtn: {
    backgroundColor: Colors.navyBtn,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: Radius.lg,
    marginTop: Spacing.sm,
  },

  emptyBtnText: {
    color: Colors.goldLight,
    fontSize: 13,
    fontFamily: Fonts.bodyBold,
  },

  securityCard: {
    backgroundColor: Colors.card,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.line,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Colors.goldDim,
    borderWidth: 1,
    borderColor: "rgba(201,168,75,0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  securityBody: {
    flex: 1,
  },

  securityTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 4,
  },

  securityTitle: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: Fonts.bodyBold,
  },

  tfaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },

  tfaBadgeOn: {
    backgroundColor: Colors.availableBg,
    borderColor: Colors.availableBorder,
  },

  tfaBadgeOff: {
    backgroundColor: Colors.bgAlt,
    borderColor: Colors.line,
  },

  tfaDot: {
    width: 5,
    height: 5,
    borderRadius: Radius.full,
  },

  tfaLabel: {
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },

  securitySub: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: Fonts.body,
    lineHeight: 18,
  },

  tfaToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexShrink: 0,
    minWidth: 64,
    alignItems: "center",
  },

  tfaToggleOn: {
    backgroundColor: Colors.soldOutBg,
    borderColor: Colors.soldOutBorder,
  },

  tfaToggleOff: {
    backgroundColor: Colors.navyBtn,
    borderColor: Colors.lineMid,
  },

  tfaToggleText: {
    color: Colors.goldLight,
    fontSize: 12,
    fontFamily: Fonts.bodyBold,
  },

  // Login
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  scrollContent: {
    flexGrow: 1,
  },

  page: {
    flexGrow: 1,
    justifyContent: "center",
    padding: Spacing.xl,
  },

  panel: {
    backgroundColor: Colors.headerBg,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.lineMid,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },

  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.navyBtn,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },

  logoMark: {
    color: Colors.goldLight,
    fontSize: 13,
    fontFamily: Fonts.bodyExtraBold,
    letterSpacing: 1,
  },

  logoText: {
    color: Colors.goldLight,
    fontSize: 17,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.3,
  },

  panelHeading: {
    color: Colors.goldLight,
    fontSize: 32,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  panelSub: {
    color: Colors.mutedStrong,
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 21,
    marginBottom: Spacing.xl,
  },

  perks: {
    gap: Spacing.md,
  },

  perkItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  perkDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.gold,
    marginRight: Spacing.md,
  },

  perkText: {
    color: Colors.text,
    fontSize: 14,
    fontFamily: Fonts.body,
  },

  form: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: Radius.xxl,
    borderBottomRightRadius: Radius.xxl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.lineMid,
  },

  formTitle: {
    fontSize: 26,
    fontFamily: Fonts.display,
    color: Colors.goldLight,
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  formSub: {
    fontSize: 14,
    fontFamily: Fonts.body,
    color: Colors.muted,
    marginBottom: Spacing.xl,
  },

  errorBox: {
    backgroundColor: Colors.soldOutBg,
    borderWidth: 1,
    borderColor: Colors.soldOutBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
  },

  errorText: {
    color: Colors.soldOut,
    fontSize: 14,
    fontFamily: Fonts.body,
    lineHeight: 20,
  },

  resendLink: {
    color: Colors.gold,
    fontSize: 13,
    fontFamily: Fonts.bodyBold,
    textDecorationLine: "underline",
  },

  resendSuccess: {
    color: Colors.available,
    fontSize: 12,
    fontFamily: Fonts.body,
    marginTop: 4,
  },

  field: {
    marginBottom: Spacing.lg,
  },

  label: {
    fontSize: 11,
    fontFamily: Fonts.bodyBold,
    color: Colors.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.line,
    backgroundColor: Colors.bg,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: Fonts.body,
    color: Colors.text,
  },

  otpInput: {
    fontSize: 22,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 6,
    textAlign: "center",
  },

  otpHint: {
    color: Colors.muted,
    fontSize: 12,
    fontFamily: Fonts.body,
    marginTop: 6,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xxl,
  },

  rememberText: {
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
    color: Colors.text,
  },

  submitBtn: {
    backgroundColor: Colors.navyBtn,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: Spacing.xl,
  },

  submitBtnDisabled: {
    opacity: 0.6,
  },

  submitBtnText: {
    color: Colors.goldLight,
    fontSize: 15,
    fontFamily: Fonts.bodyBold,
    letterSpacing: 0.5,
  },

  footer: {
    textAlign: "center",
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.body,
  },

  footerLink: {
    color: Colors.gold,
    fontFamily: Fonts.bodyBold,
  },

  backLink: {
    color: Colors.muted,
    fontSize: 14,
    fontFamily: Fonts.bodySemiBold,
    textAlign: "center",
  },
});
