import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const API = "https://dinhjemmebaneapi.runasp.net/api";

// ─── Typer ───────────────────────────────────────────────────────────────────

export type User = { email: string; role: string };

export type LoginResult =
  | { ok: true }
  | { otp: true; otpToken: string }
  | { needsConfirmation: true; email: string }
  | { error: string };

export type OtpResult =
  | { ok: true }
  | { tooManyAttempts: true }
  | { error: string };

export type ResendResult =
  | { ok: true }
  | { cooldown: number }
  | { error: string };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<LoginResult>;
  verifyOtp: (otpToken: string, code: string) => Promise<OtpResult>;
  resendConfirmation: (email: string) => Promise<ResendResult>;
  logout: () => Promise<void>;
};

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth skal bruges inden i AuthProvider");
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Gendan session fra AsyncStorage ved app-start
  useEffect(() => {
    AsyncStorage.multiGet(["user_email", "user_role"]).then(([[, email], [, role]]) => {
      if (email) setUser({ email, role: role ?? "CUSTOMER" });
      setLoading(false);
    });
  }, []);

  // Henter brugerinfo fra API'et og gemmer den i state + AsyncStorage
  async function finishLogin(): Promise<{ ok: true } | { error: string }> {
    try {
      const res = await fetch(`${API}/securewebsite/xhtlekd`, {
        credentials: "include",
      });
      if (!res.ok) return { error: "Kunne ikke hente brugerinfo." };

      const data = await res.json();
      const email: string = data.user.email;
      const role: string = data.user.roles?.[0] ?? "CUSTOMER";

      await AsyncStorage.multiSet([
        ["user_email", email],
        ["user_role", role],
      ]);
      setUser({ email, role });
      return { ok: true };
    } catch {
      return { error: "Netværksfejl." };
    }
  }

  // ─── Login med email + adgangskode ───────────────────────────────────────

  async function login(
    email: string,
    password: string,
    remember: boolean
  ): Promise<LoginResult> {
    try {
      const res = await fetch(`${API}/securewebsite/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ Email: email, Password: password, Remember: remember }),
      });

      if (res.status === 429) return { error: "For mange forsøg – prøv igen om lidt." };

      // 2FA krævet
      if (res.status === 202) {
        const data = await res.json();
        return { otp: true, otpToken: data.otpToken };
      }

      const data = await res.json();

      // Email ikke bekræftet
      if (res.status === 401 && data.needsConfirmation) {
        return { needsConfirmation: true, email };
      }

      if (!res.ok) return { error: data.message || "Noget gik galt, prøv igen." };

      return await finishLogin();
    } catch {
      return { error: "Kunne ikke kontakte serveren." };
    }
  }

  // ─── OTP-bekræftelse ─────────────────────────────────────────────────────

  async function verifyOtp(otpToken: string, code: string): Promise<OtpResult> {
    try {
      const res = await fetch(`${API}/securewebsite/verify-otp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ otpToken, code }),
      });

      if (res.status === 429) return { error: "For mange forsøg – prøv igen om lidt." };

      const data = await res.json();

      if (!res.ok) {
        if (data.tooManyAttempts) return { tooManyAttempts: true };
        return { error: data.message || "Forkert kode eller koden er udløbet." };
      }

      const result = await finishLogin();
      if ("error" in result) return { error: result.error };
      return { ok: true };
    } catch {
      return { error: "Kunne ikke kontakte serveren." };
    }
  }

  // ─── Gensend bekræftelsesemail ───────────────────────────────────────────

  async function resendConfirmation(email: string): Promise<ResendResult> {
    try {
      const res = await fetch(`${API}/securewebsite/resend-confirmation`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        const data = await res.json();
        return { cooldown: data.retryAfterSeconds ?? 120 };
      }

      return { ok: true };
    } catch {
      return { error: "Kunne ikke kontakte serveren." };
    }
  }

  // ─── Log ud ──────────────────────────────────────────────────────────────

  async function logout() {
    try {
      await fetch(`${API}/securewebsite/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Fortsæt uanset — ryd session lokalt
    }
    await AsyncStorage.multiRemove(["user_email", "user_role"]);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, verifyOtp, resendConfirmation, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
