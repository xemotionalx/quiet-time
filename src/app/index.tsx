import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/ui";

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
    <View style={styles.container}>
      {!isLoading && profile ? (
        <Text>
          Signed in as {profile.display_name} (@{profile.username})
        </Text>
      ) : null}
      <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
