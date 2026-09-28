import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
} from "react-native";

import { Icon, type IconName } from "./Icon";
import { colors, radius, size, strokeWidth } from "@/theme/tokens";

type IconButtonProps = {
  name: IconName;
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export function IconButton({
  name,
  label,
  onPress,
  disabled,
}: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Icon
        name={name}
        size={24}
        color={disabled ? colors.smoke : colors.chalk}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: size.touchMin,
    height: size.touchMin,
    borderRadius: radius.pill,
    borderWidth: strokeWidth,
    borderColor: colors.chalk,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    borderColor: colors.ash,
  },
});
