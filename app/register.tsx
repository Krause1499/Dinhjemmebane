import { router, Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Fonts, Radius, Spacing } from "../theme";

const API = "https://dinhjemmebaneapi.runasp.net/api";

// ─── Adgangskoderegler (matcher hjemmesiden) ──────────────────────────────────

const PW_RULES = [
  { label: "Mindst 8 tegn",            test: (pw: string) => pw.length >= 8 },
  { label: "Mindst ét stort bogstav",   test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "Mindst ét lille bogstav",   test: (pw: string) => /[a-z]/.test(pw) },
  { label: "Mindst ét tal",             test: (pw: string) => /[0-9]/.test(pw) },
];

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwDirty, setPwDirty] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister() {
    setError("");

    if (!name || !email || !password) {
      setError("Udfyld alle felter.");
      return;
    }

    const unmetRules = PW_RULES.filter((r) => !r.test(password));
    if (unmetRules.length > 0) {
      setError("Adgangskoden opfylder ikke alle krav.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API}/securewebsite/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ Name: name, Email: email, Password: password }),
      });

      if (res.status === 429) {
        setError("For mange forsøg – prøv igen om lidt.");
        return;
      }

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        return;
      }

      if (data.errors?.length) {
        setError(data.errors.map((e: { description: string }) => e.description).join(" "));
      } else {
        setError(data.message || "Noget gik galt, prøv igen.");
      }
    } catch {
      setError("Kunne ikke kontakte serveren.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Opret konto" }} />
      <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
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
              <View style={styles.logoRow}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoMark}>DH</Text>
                </View>
                <Text style={styles.logoText}>Din Hjemmebane</Text>
              </View>
              <Text style={styles.panelHeading}>Bliv en del af holdet</Text>
              <Text style={styles.panelSub}>
                Opret en konto og hold styr på dine ordrer fra ét sted.
              </Text>
              <View style={styles.perks}>
                {[
                  "Se alle dine ordrer samlet",
                  "Hurtigere checkout næste gang",
                  "Gratis og uforpligtende",
                ].map((p) => (
                  <View key={p} style={styles.perkItem}>
                    <View style={styles.perkDot} />
                    <Text style={styles.perkText}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Formular */}
            <View style={styles.form}>

              {success ? (
                // ─── Succes-tilstand ────────────────────────────────────────
                <View style={styles.successBox}>
                  <Text style={styles.successTitle}>Konto oprettet!</Text>
                  <Text style={styles.successText}>
                    Tjek din email og bekræft din konto for at logge ind.
                  </Text>
                  <Pressable
                    style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }]}
                    onPress={() => router.back()}
                  >
                    <Text style={styles.submitBtnText}>Gå til login →</Text>
                  </Pressable>
                </View>
              ) : (
                // ─── Formular ───────────────────────────────────────────────
                <>
                  <Text style={styles.formTitle}>Opret konto</Text>
                  <Text style={styles.formSub}>Udfyld formularen for at komme i gang</Text>

                  {!!error && (
                    <View style={styles.errorBox}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  )}

                  <View style={styles.field}>
                    <Text style={styles.label}>Navn</Text>
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Dit fulde navn"
                      placeholderTextColor={Colors.muted}
                      autoCapitalize="words"
                      autoCorrect={false}
                      returnKeyType="next"
                      style={styles.input}
                    />
                  </View>

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
                      onChangeText={(v) => { setPassword(v); setPwDirty(true); }}
                      placeholder="Vælg en adgangskode"
                      placeholderTextColor={Colors.muted}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="done"
                      onSubmitEditing={handleRegister}
                      style={styles.input}
                    />
                  </View>

                  {/* Live password-regler */}
                  {pwDirty && (
                    <View style={styles.pwRules}>
                      {PW_RULES.map((rule) => {
                        const met = rule.test(password);
                        return (
                          <View key={rule.label} style={styles.pwRule}>
                            <View style={[styles.pwRuleDot, met && styles.pwRuleDotMet]}>
                              {met && <Text style={styles.pwRuleCheck}>✓</Text>}
                            </View>
                            <Text style={[styles.pwRuleText, met && styles.pwRuleTextMet]}>
                              {rule.label}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  <Pressable
                    style={({ pressed }) => [
                      styles.submitBtn,
                      pressed && { opacity: 0.85 },
                      submitting && styles.submitBtnDisabled,
                    ]}
                    onPress={handleRegister}
                    disabled={submitting}
                  >
                    {submitting
                      ? <ActivityIndicator color={Colors.goldLight} />
                      : <Text style={styles.submitBtnText}>Opret konto</Text>
                    }
                  </Pressable>

                  <Text style={styles.footer}>
                    Har du allerede en konto?{" "}
                    <Text style={styles.footerLink} onPress={() => router.back()}>
                      Log ind
                    </Text>
                  </Text>
                </>
              )}

            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
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

  pwRules: {
    gap: 8,
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.bg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.line,
  },

  pwRule: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  pwRuleDot: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.lineMid,
    backgroundColor: Colors.bgAlt,
    alignItems: "center",
    justifyContent: "center",
  },

  pwRuleDotMet: {
    backgroundColor: Colors.navyBtn,
    borderColor: Colors.gold,
  },

  pwRuleCheck: {
    color: Colors.gold,
    fontSize: 10,
    fontFamily: Fonts.bodyBold,
  },

  pwRuleText: {
    color: Colors.muted,
    fontSize: 13,
    fontFamily: Fonts.body,
  },

  pwRuleTextMet: {
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

  successBox: {
    alignItems: "center",
    gap: Spacing.lg,
    paddingVertical: Spacing.xl,
  },

  successTitle: {
    color: Colors.available,
    fontSize: 32,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
  },

  successText: {
    color: Colors.mutedStrong,
    fontSize: 15,
    fontFamily: Fonts.body,
    lineHeight: 23,
    textAlign: "center",
  },
});
