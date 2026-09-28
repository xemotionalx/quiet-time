import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import { supabase } from "@/lib/supabase";
import {
  getConfirmPasswordError,
  getPasswordError,
  isValidEmail,
} from "@/lib/validation";
import { Button, ErrorMessage, TextField } from "@/ui";

export default function SignUp() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [displayNameError, setDisplayNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkDisplayNameAvailable(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return true;

    const { data } = await supabase.rpc("is_display_name_available", {
      name: trimmed,
    });

    if (data === false) {
      setDisplayNameError("That name is taken");
      return false;
    }
    return true;
  }

  async function handleDisplayNameBlur() {
    await checkDisplayNameAvailable(displayName);
  }

  async function handleSubmit() {
    const trimmedName = displayName.trim();
    const nameError = trimmedName ? "" : "Display name is required";
    const emailValidationError = isValidEmail(email)
      ? ""
      : "Enter a valid email address";
    const passwordValidationError = getPasswordError(password) ?? "";
    const confirmValidationError =
      getConfirmPasswordError(password, confirmPassword) ?? "";

    setDisplayNameError(nameError);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmValidationError);
    setFormError("");

    if (
      nameError ||
      emailValidationError ||
      passwordValidationError ||
      confirmValidationError
    ) {
      return;
    }

    setLoading(true);
    const isAvailable = await checkDisplayNameAvailable(trimmedName);
    if (!isAvailable) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: trimmedName } },
    });
    setLoading(false);

    if (!error) {
      router.push({ pathname: "/verify", params: { email } });
      return;
    }

    if (error.message === "Database error saving new user") {
      setDisplayNameError("That name is taken");
      return;
    }

    setFormError(error.message);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TextField
        label="Display name"
        value={displayName}
        onChangeText={setDisplayName}
        onBlur={handleDisplayNameBlur}
        autoCapitalize="words"
        autoComplete="name"
        maxLength={50}
        error={displayNameError}
      />
      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={emailError}
      />
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        error={passwordError}
      />
      <TextField
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        error={confirmPasswordError}
      />
      <Button
        title="Sign Up"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
      />
      <ErrorMessage message={formError} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
