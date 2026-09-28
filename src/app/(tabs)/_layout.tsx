import { Home01Icon, UserCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tabs } from "expo-router";

import { colors, iconStroke, strokeWidth } from "@/theme/tokens";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.chalk,
        tabBarInactiveTintColor: colors.smoke,
        tabBarStyle: {
          backgroundColor: colors.ink,
          borderTopColor: colors.ash,
          borderTopWidth: strokeWidth,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon
              icon={Home01Icon}
              color={color}
              size={24}
              strokeWidth={iconStroke}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon
              icon={UserCircleIcon}
              color={color}
              size={24}
              strokeWidth={iconStroke}
            />
          ),
        }}
      />
    </Tabs>
  );
}
