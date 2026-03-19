import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = "https://dinhjemmebaneapi.runasp.net/api/securewebsite/login";

  async function handleSubmit() {
    setErrorMessage("");

    const loginDto = {
      email,
      password,
      remember,
    };

    if (!email || !password) {
      setErrorMessage("Udfyld både email og adgangskode.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginDto),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Login fejlede.");
        return;
      }

      Alert.alert("Succes", data.message || "Login gennemført.");
    } catch (error) {
      setErrorMessage("Kunne ikke kontakte serveren.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

        <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContent}
            enableOnAndroid={true}
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
          <View style={styles.page}>
            <View style={styles.card}>
              <View style={styles.panel}>
                <View style={styles.logoRow}>
                  <View style={styles.logoCircle}>
                    <Text style={styles.logoMark}>DH</Text>
                  </View>
                  <Text style={styles.logoText}>Din Hjemmebane</Text>
                </View>

                <Text style={styles.panelHeading}>Log ind på din konto</Text>
                <Text style={styles.panelSub}>
                  Få adgang til din ordrehistorik og en hurtigere checkout.
                </Text>

                <View style={styles.perks}>
                  <View style={styles.perkItem}>
                    <View style={styles.perkDot} />
                    <Text style={styles.perkText}>
                      Se alle dine ordrer samlet
                    </Text>
                  </View>

                  <View style={styles.perkItem}>
                    <View style={styles.perkDot} />
                    <Text style={styles.perkText}>
                      Hurtigere checkout næste gang
                    </Text>
                  </View>

                  <View style={styles.perkItem}>
                    <View style={styles.perkDot} />
                    <Text style={styles.perkText}>
                      Sikker og krypteret forbindelse
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.form}>
                <Text style={styles.title}>Velkommen tilbage</Text>
                <Text style={styles.sub}>Log ind for at fortsætte</Text>

                {!!errorMessage && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                )}

                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="din@email.dk"
                    placeholderTextColor="#94A3B8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Adgangskode</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Indtast din adgangskode"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.input}
                  />
                </View>

                <View style={styles.rememberRow}>
                  <Text style={styles.rememberText}>Husk mig</Text>
                  <Switch value={remember} onValueChange={setRemember} />
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.submitButtonPressed,
                    loading && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitButtonText}>Log ind</Text>
                  )}
                </Pressable>

                <Text style={styles.footer}>
                  Har du ikke en konto?{" "}
                  <Text style={styles.footerLink}>Opret konto</Text>
                </Text>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  keyboardWrapper: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  page: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  panel: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  logoMark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  panelHeading: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
    marginBottom: 8,
  },

  panelSub: {
    color: "#CBD5E1",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },

  perks: {
    gap: 12,
  },

  perkItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  perkDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#38BDF8",
    marginRight: 10,
  },

  perkText: {
    color: "#E2E8F0",
    fontSize: 14,
    lineHeight: 20,
  },

  form: {
    paddingHorizontal: 24,
    paddingVertical: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },

  sub: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 20,
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 16,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 14,
    lineHeight: 20,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0F172A",
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 24,
  },

  rememberText: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "600",
  },

  submitButton: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },

  submitButtonPressed: {
    opacity: 0.9,
  },

  submitButtonDisabled: {
    opacity: 0.7,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  footer: {
    textAlign: "center",
    color: "#64748B",
    fontSize: 14,
    lineHeight: 20,
  },

  footerLink: {
    color: "#0F172A",
    fontWeight: "700",
  },
});