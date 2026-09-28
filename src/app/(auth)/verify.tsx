import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";
import { Button, ErrorMessage, TextField, TextLink } from "@/components";
import { colors, space, type } from "@/theme/tokens";

const RESEND_COOLDOWN_SECONDS = 60;

export default function Verify() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((seconds) => Math.max(seconds - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    setLoading(false);

    if (verifyError) {
      setError(verifyError.message);
    }
  }

  async function handleResend() {
    setError("");
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (resendError) {
      setError(resendError.message);
      return;
    }
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.text}>Enter the code sent to {email}</Text>
        <TextField
          label="Code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          textContentType="oneTimeCode"
        />
        <Button onPress={handleSubmit} disabled={loading} block>
          Verify
        </Button>
        <TextLink onPress={handleResend} disabled={cooldown > 0}>
          {cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
        </TextLink>
        <ErrorMessage message={error} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.ink },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: space.space6,
    gap: space.space5,
  },
  text: {
    fontSize: type.body.fontSize,
    lineHeight: type.body.lineHeight,
    fontWeight: type.body.fontWeight,
    color: colors.chalk,
    textAlign: "center",
  },
});
