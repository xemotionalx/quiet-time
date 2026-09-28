import {
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
} from "react-native";

import { colors, radius, size, space, strokeWidth, type } from "@/theme/tokens";

type ButtonProps = {
  variant?: "filled" | "outline";
  block?: boolean;
  disabled?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  children: string;
};

export function Button({
  variant = "filled",
  block,
  disabled,
  onPress,
  children,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        variant === "filled" ? styles.filled : styles.outline,
        block && styles.block,
        pressed &&
          !disabled &&
          (variant === "filled" ? styles.filledPressed : styles.outlinePressed),
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "filled" ? styles.filledLabel : styles.outlineLabel,
          disabled && styles.disabledLabel,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: size.controlButton,
    borderRadius: radius.pill,
    borderWidth: strokeWidth,
    borderColor: colors.chalk,
    paddingHorizontal: space.space6,
    alignItems: "center",
    justifyContent: "center",
  },
  block: {
    alignSelf: "stretch",
  },
  filled: {
    backgroundColor: colors.chalk,
  },
  filledPressed: {
    backgroundColor: colors.chalkPressed,
    borderColor: colors.chalkPressed,
  },
  outline: {
    backgroundColor: colors.ink,
  },
  outlinePressed: {
    backgroundColor: colors.inkRaised,
  },
  disabled: {
    backgroundColor: colors.ink,
    borderColor: colors.ash,
  },
  label: {
    fontSize: type.button.fontSize,
    lineHeight: type.button.lineHeight,
    fontWeight: type.button.fontWeight,
  },
  filledLabel: {
    color: colors.ink,
  },
  outlineLabel: {
    color: colors.chalk,
  },
  disabledLabel: {
    color: colors.smoke,
  },
});
