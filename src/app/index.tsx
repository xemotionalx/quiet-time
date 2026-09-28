import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components";
import { colors, space, type } from "@/theme/tokens";

export default function Index() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<{
    display_name: string | null;
    username: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    let isMounted = true;
    supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        if (isMounted) {
          setProfile(data ?? null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [session]);

  if (!session) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {!isLoading && profile ? (
          <Text style={styles.text}>
            Signed in as {profile.display_name} (@{profile.username})
          </Text>
        ) : null}
        <Button block onPress={() => supabase.auth.signOut()}>
          Sign Out
        </Button>
      </View>
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
