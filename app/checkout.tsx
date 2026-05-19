import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useCart } from "../context/CartContext";
import { Colors, Fonts, Radius, Spacing } from "../theme";

const API = "https://api.dinhjemmebane.dk/api";

type Form = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  note: string;
};

const EMPTY_FORM: Form = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  country: "DK",
  note: "",
};

export default function CheckoutScreen() {
  const { items } = useCart();
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof Form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    const { firstName, lastName, email, phone, address, postalCode, city, country } = form;
    if (!firstName || !lastName || !email || !phone || !address || !postalCode || !city) {
      setError("Udfyld venligst alle påkrævede felter.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const orderDto = {
        firstName,
        lastName,
        email,
        phoneNumber: phone,
        address,
        postalCode,
        city,
        country,
        note: form.note.trim() || null,
        orderItems: items.map((item) => ({
          shirtId: item.itemType === "mysterybox" ? null : item.id,
          mysteryBoxId: item.itemType === "mysterybox" ? item.id : null,
        })),
      };

      const response = await fetch(`${API}/payment/GeneratePayment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDto),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        let message = `Fejl ${response.status}`;
        try {
          const data = JSON.parse(text);
          message = data.error ?? data.title ?? data.message ?? text ?? message;
        } catch {
          if (text) message = text;
        }
        throw new Error(message);
      }

      const data = await response.json();

      router.push({
        pathname: "/payment",
        params: {
          sessionId: data.id,
          orderHandle: data.orderHandle,
          referenceId: data.referenceId,
        },
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Noget gik galt. Prøv igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Section title="Personoplysninger">
        <Row>
          <Field label="Fornavn *" style={styles.half}>
            <TextInput
              style={styles.input}
              value={form.firstName}
              onChangeText={(v) => set("firstName", v)}
              placeholder="Anders"
              placeholderTextColor={Colors.muted}
              autoCapitalize="words"
            />
          </Field>
          <Field label="Efternavn *" style={styles.half}>
            <TextInput
              style={styles.input}
              value={form.lastName}
              onChangeText={(v) => set("lastName", v)}
              placeholder="Hansen"
              placeholderTextColor={Colors.muted}
              autoCapitalize="words"
            />
          </Field>
        </Row>
        <Field label="E-mail *">
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(v) => set("email", v)}
            placeholder="anders@eksempel.dk"
            placeholderTextColor={Colors.muted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Field>
        <Field label="Telefon *">
          <TextInput
            style={styles.input}
            value={form.phone}
            onChangeText={(v) => set("phone", v)}
            placeholder="12345678"
            placeholderTextColor={Colors.muted}
            keyboardType="phone-pad"
          />
        </Field>
      </Section>

      <Section title="Leveringsadresse">
        <Field label="Adresse *">
          <TextInput
            style={styles.input}
            value={form.address}
            onChangeText={(v) => set("address", v)}
            placeholder="Fodboldgade 1"
            placeholderTextColor={Colors.muted}
            autoCapitalize="words"
          />
        </Field>
        <Row>
          <Field label="Postnummer *" style={styles.third}>
            <TextInput
              style={styles.input}
              value={form.postalCode}
              onChangeText={(v) => set("postalCode", v)}
              placeholder="8000"
              placeholderTextColor={Colors.muted}
              keyboardType="numeric"
              maxLength={4}
            />
          </Field>
          <Field label="By *" style={styles.twoThirds}>
            <TextInput
              style={styles.input}
              value={form.city}
              onChangeText={(v) => set("city", v)}
              placeholder="Aarhus"
              placeholderTextColor={Colors.muted}
              autoCapitalize="words"
            />
          </Field>
        </Row>
        <Field label="Land">
          <TextInput
            style={styles.input}
            value={form.country}
            onChangeText={(v) => set("country", v.toUpperCase())}
            placeholder="DK"
            placeholderTextColor={Colors.muted}
            autoCapitalize="characters"
            maxLength={2}
          />
        </Field>
      </Section>

      <Section title="Yderligere oplysninger">
        <Field label="Note til ordren">
          <TextInput
            style={[styles.input, styles.textArea]}
            value={form.note}
            onChangeText={(v) => set("note", v)}
            placeholder="Særlige ønsker eller bemærkninger..."
            placeholderTextColor={Colors.muted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </Field>
      </Section>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Pressable
        style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.85 }, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color={Colors.navyDeep} />
          : <Text style={styles.submitBtnText}>Gå til betaling →</Text>
        }
      </Pressable>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingBottom: 48,
    backgroundColor: Colors.bg,
  },

  section: {
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    color: Colors.goldLight,
    fontSize: 20,
    fontFamily: Fonts.display,
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.line,
    paddingBottom: Spacing.sm,
  },

  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  half: {
    flex: 1,
  },

  third: {
    flex: 1,
  },

  twoThirds: {
    flex: 2,
  },

  field: {
    marginBottom: Spacing.md,
  },

  label: {
    color: Colors.muted,
    fontSize: 11,
    fontFamily: Fonts.bodySemiBold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.lineMid,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    color: Colors.goldLight,
    fontSize: 15,
    fontFamily: Fonts.body,
  },

  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },

  errorBox: {
    backgroundColor: Colors.soldOutBg,
    borderWidth: 1,
    borderColor: Colors.soldOutBorder,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },

  errorText: {
    color: Colors.soldOut,
    fontSize: 13,
    fontFamily: Fonts.body,
    lineHeight: 19,
  },

  submitBtn: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: Radius.full,
    alignItems: "center",
  },

  submitBtnDisabled: {
    opacity: 0.6,
  },

  submitBtnText: {
    color: Colors.navyDeep,
    fontSize: 15,
    fontFamily: Fonts.bodyExtraBold,
    letterSpacing: 0.5,
  },
});
