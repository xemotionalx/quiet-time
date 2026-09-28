import {
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
} from "react-native";

import { aliases, colors, space, type } from "@/theme/tokens";

type TextLinkProps = {
  children: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export function TextLink({ children, onPress, disabled }: TextLinkProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="link"
      accessibilityState={{ disabled: !!disabled }}
      hitSlop={space.space2}
    >
      {({ pressed }) => (
        <Text
          style={[
            styles.text,
            {
              color: disabled
                ? colors.smoke
                : pressed
                  ? colors.lavenderLight
                  : aliases.link,
            },
          ]}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: type.label.fontSize,
    lineHeight: type.label.lineHeight,
    fontWeight: type.label.fontWeight,
    textDecorationLine: "underline",
  },
});
