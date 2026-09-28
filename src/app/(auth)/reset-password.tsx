import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from "react-native";

import { supabase } from "@/lib/supabase";
import { getConfirmPasswordError, getPasswordError } from "@/lib/validation";
import { Button, ErrorMessage, TextField, TextLink } from "@/ui";

const RESEND_COOLDOWN_SECONDS = 60;

export default function ResetPassword() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formError, setFormError] = useState("");
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
    const passwordValidationError = getPasswordError(password) ?? "";
    const confirmValidationError =
      getConfirmPasswordError(password, confirmPassword) ?? "";

    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmValidationError);
    setFormError("");

    if (passwordValidationError || confirmValidationError) {
      return;
    }

    setLoading(true);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "recovery",
    });

    if (verifyError) {
      setLoading(false);
      setFormError(verifyError.message);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (updateError) {
      setFormError(updateError.message);
    }
  }

  async function handleResend() {
    setFormError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setFormError(error.message);
      return;
    }
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text>Enter the code sent to {email} and choose a new password</Text>
      <TextField
        label="Code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        textContentType="oneTimeCode"
      />
      <TextField
        label="New password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        error={passwordError}
      />
      <TextField
        label="Confirm new password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        error={confirmPasswordError}
      />
      <Button
        title="Reset password"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
      <TextLink
        title={cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend code"}
        onPress={handleResend}
        disabled={cooldown > 0}
      />
      <ErrorMessage message={formError} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
