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
import { Button, ErrorMessage, Icon, TextField, TextLink } from "@/components";
import { aliases, colors, space, type } from "@/theme/tokens";

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

    setError(signInError.message);
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
              <Icon name="moon" size={64} strokeWidth={3} />
            </View>
            <View style={styles.header}>
              <Text style={styles.heading}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign back in to the Quiet Time app.
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
              />
              <View>
                <TextField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  placeholder="Your password"
                />
                <View style={styles.forgotRow}>
                  <TextLink onPress={() => router.push("/forgot-password")}>
                    Forgot password?
                  </TextLink>
                </View>
              </View>
            </View>
            {error ? (
              <View style={styles.errorContainer}>
                <ErrorMessage message={error} />
              </View>
            ) : null}
          </View>
          <View style={styles.actions}>
            <Button onPress={handleSubmit} disabled={loading} block>
              Sign in
            </Button>
            <Button
              variant="outline"
              onPress={() => router.push("/sign-up")}
              block
            >
              Create an account
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
  forgotRow: {
    alignItems: "flex-end",
    marginTop: space.space2,
  },
  errorContainer: {
    marginTop: space.space5,
  },
  actions: { gap: space.space4, marginTop: space.space8 },
});
