import { StyleSheet, Text } from "react-native";

import { colors, type } from "@/theme/tokens";

type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return <Text style={styles.text}>{message}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: type.fieldMessage.fontSize,
    lineHeight: type.fieldMessage.lineHeight,
    fontWeight: type.fieldMessage.fontWeight,
    color: colors.chalk,
  },
});
