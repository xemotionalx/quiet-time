import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";
import {
  getConfirmPasswordError,
  getPasswordError,
  isValidEmail,
} from "@/lib/validation";
import { Button, ErrorMessage, IconButton, TextField } from "@/components";
import { aliases, colors, space, type } from "@/theme/tokens";

// hook_before_user_created (supabase/migrations) rejects with HTTP 403 and
// this message when the email isn't in approved_emails.
const NOT_APPROVED_STATUS = 403;
const NOT_APPROVED_HINT = "Quiet Time list";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const emailValidationError = isValidEmail(email)
      ? ""
      : "Enter a valid email address";
    const passwordValidationError = getPasswordError(password) ?? "";
    const confirmValidationError =
      getConfirmPasswordError(password, confirmPassword) ?? "";

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);
    setConfirmPasswordError(confirmValidationError);
    setFormError("");

    if (
      emailValidationError ||
      passwordValidationError ||
      confirmValidationError
    ) {
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (!error) {
      return;
    }

    if (
      error.status === NOT_APPROVED_STATUS &&
      error.message.includes(NOT_APPROVED_HINT)
    ) {
      setEmailError(error.message);
      return;
    }

    setFormError(error.message);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <View style={styles.top}>
              <IconButton
                name="back"
                label="Back to sign in"
                onPress={() => router.back()}
              />
            </View>
            <View style={styles.header}>
              <Text style={styles.heading}>Sign up</Text>
              <Text style={styles.subtitle}>
                Create an account to get started.
              </Text>
            </View>
            <View style={styles.fields}>
              <TextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder="you@example.com"
                error={emailError}
              />
              <TextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                error={passwordError}
              />
              <TextField
                label="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete="new-password"
                placeholder="Type it once more"
                error={confirmPasswordError}
              />
            </View>
            {formError ? (
              <View style={styles.errorContainer}>
                <ErrorMessage message={formError} />
              </View>
            ) : null}
          </View>
          <View style={styles.actions}>
            <Button onPress={handleSubmit} disabled={loading} block>
              Create account
            </Button>
            <Button variant="outline" onPress={() => router.back()} block>
              I already have an account
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.ink },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: space.space6,
    paddingVertical: space.space6,
  },
  top: { marginBottom: space.space8 },
  header: { gap: space.space2, marginBottom: space.space8 },
  heading: {
    fontSize: type.screenHeading.fontSize,
    lineHeight: type.screenHeading.lineHeight,
    fontWeight: type.screenHeading.fontWeight,
    color: aliases.heading,
  },
  subtitle: {
    fontSize: type.body.fontSize,
    lineHeight: type.body.lineHeight,
    fontWeight: type.body.fontWeight,
    color: colors.mist,
  },
  fields: { gap: space.space5 },
  errorContainer: {
    marginTop: space.space5,
  },
  actions: { gap: space.space4, marginTop: space.space8 },
});
