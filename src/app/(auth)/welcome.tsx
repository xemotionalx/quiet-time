import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components";
import { colors, space } from "@/theme/tokens";

export default function Welcome() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Button block onPress={() => router.push("/sign-in")}>
          Sign In
        </Button>
        <Button variant="outline" block onPress={() => router.push("/sign-up")}>
          Sign Up
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
    gap: space.space4,
  },
});
