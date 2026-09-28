import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/ui";

export default function Index() {
  const { session } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    let isMounted = true;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        if (isMounted) {
          setDisplayName(data?.display_name ?? null);
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
      {!isLoading ? (
        <Text>Signed in as {displayName ?? session.user.email}</Text>
      ) : null}
      <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
