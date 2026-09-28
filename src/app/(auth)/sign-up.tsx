import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet } from "react-native";

import { supabase } from "@/lib/supabase";
import {
  getConfirmPasswordError,
  getDisplayNameError,
  getPasswordError,
  getUsernameError,
  isValidEmail,
} from "@/lib/validation";
import { Button, ErrorMessage, TextField } from "@/ui";

export default function SignUp() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [displayNameError, setDisplayNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkUsernameAvailable(name: string) {
    const { data } = await supabase.rpc("is_username_available", {
      name,
    });

    if (data === false) {
      setUsernameError("That username is taken");
      return false;
    }
    return true;
  }

  async function handleUsernameBlur() {
    if (getUsernameError(username)) return;
    await checkUsernameAvailable(username);
  }

  async function handleSubmit() {
    const nameError = getDisplayNameError(displayName) ?? "";
    const usernameValidationError = getUsernameError(username) ?? "";
    const emailValidationError = isValidEmail(email)
      ? ""
      : "Enter a valid email address";
    const passwordValidationError = getPasswordError(password) ?? "";
    const confirmValidationError =
      getConfirmPasswordError(password, confirmPassword) ?? "";

    setDisplayNameError(nameError);
    setUsernameError(usernameValidationError);
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmValidationError);
    setFormError("");

    if (
      nameError ||
      usernameValidationError ||
      emailValidationError ||
      passwordValidationError ||
      confirmValidationError
    ) {
      return;
    }

    setLoading(true);
    const isAvailable = await checkUsernameAvailable(username);
    if (!isAvailable) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName.trim(), username } },
    });
    setLoading(false);

    if (!error) {
      router.push({ pathname: "/verify", params: { email } });
      return;
    }

    if (error.message === "Database error saving new user") {
      setUsernameError("That username is taken");
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
        autoCapitalize="words"
        autoComplete="name"
        maxLength={50}
        error={displayNameError}
      />
      <TextField
        label="Username"
        value={username}
        onChangeText={(t) => setUsername(t.toLowerCase())}
        onBlur={handleUsernameBlur}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        maxLength={30}
        error={usernameError}
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
