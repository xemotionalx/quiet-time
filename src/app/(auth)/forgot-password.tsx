import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";
import { isValidEmail } from "@/lib/validation";
import { Button, ErrorMessage, TextField } from "@/components";
import { colors, space } from "@/theme/tokens";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
    setEmailError("");
    setFormError("");
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);

    if (error) {
      setFormError(error.message);
      return;
    }

    router.push({ pathname: "/reset-password", params: { email } });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
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
          error={emailError}
        />
        <Button onPress={handleSubmit} disabled={loading} block>
          Send code
        </Button>
        <ErrorMessage message={formError} />
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
});
