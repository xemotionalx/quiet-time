import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from "react-native";

import { supabase } from "@/lib/supabase";
import { Button, ErrorMessage, TextField, TextLink } from "@/ui";

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text>Enter the code sent to {email}</Text>
      <TextField
        label="Code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        textContentType="oneTimeCode"
      />
      <Button
        title="Verify"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
      <TextLink
        title={cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
        onPress={handleResend}
        disabled={cooldown > 0}
      />
      <ErrorMessage message={error} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
