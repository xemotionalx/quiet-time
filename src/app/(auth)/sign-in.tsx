import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import { supabase } from "@/lib/supabase";
import { Button, ErrorMessage, TextField, TextLink } from "@/ui";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (!signInError) return;

    if (signInError.code === "email_not_confirmed") {
      await supabase.auth.resend({ type: "signup", email });
      router.push({ pathname: "/verify", params: { email } });
      return;
    }

    setError(signInError.message);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
      />
      <TextLink
        title="Forgot password?"
        onPress={() => router.push("/forgot-password")}
      />
      <Button
        title="Sign In"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
      <ErrorMessage message={error} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
