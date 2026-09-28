import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Button } from "@/ui";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Button title="Sign In" onPress={() => router.push("/sign-in")} />
      <Button title="Sign Up" onPress={() => router.push("/sign-up")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
