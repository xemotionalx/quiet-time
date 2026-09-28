import { StatusBar } from "expo-status-bar";
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
import { useAuth } from "@/providers/AuthProvider";
import { getDisplayNameError, getUsernameError } from "@/lib/validation";
import { Button, ErrorMessage, TextField, TextLink } from "@/components";
import { aliases, colors, space, type } from "@/theme/tokens";

export default function CompleteProfile() {
  const { session, refreshProfileStatus } = useAuth();
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkUsernameAvailable(name: string) {
    const { data } = await supabase.rpc("is_username_available", { name });

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
    if (!session) return;

    const usernameValidationError = getUsernameError(username) ?? "";
    const displayNameValidationError = getDisplayNameError(displayName) ?? "";

    setUsernameError(usernameValidationError);
    setDisplayNameError(displayNameValidationError);
    setFormError("");

    if (usernameValidationError || displayNameValidationError) {
      return;
    }

    setLoading(true);
    const isAvailable = await checkUsernameAvailable(username);
    if (!isAvailable) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        display_name: displayName.trim(),
        profile_completed: true,
      })
      .eq("id", session.user.id);

    if (error) {
      setLoading(false);
      if (error.code === "23505") {
        setUsernameError("That username is taken");
        return;
      }
      setFormError(error.message);
      return;
    }

    await refreshProfileStatus();
    setLoading(false);
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
            <View style={styles.header}>
              <Text style={styles.heading}>Finish your profile</Text>
              <Text style={styles.subtitle}>
                Choose a username and display name to continue.
              </Text>
            </View>
            <View style={styles.fields}>
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
                label="Display name"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
                autoComplete="name"
                maxLength={50}
                placeholder="What should we call you?"
                error={displayNameError}
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
              Continue
            </Button>
            <TextLink onPress={() => supabase.auth.signOut()}>
              Sign out
            </TextLink>
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
  errorContainer: { marginTop: space.space5 },
  actions: {
    gap: space.space4,
    marginTop: space.space8,
    alignItems: "center",
  },
});
