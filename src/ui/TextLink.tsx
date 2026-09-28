import { Pressable, Text } from "react-native";

type TextLinkProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function TextLink({ title, onPress, disabled }: TextLinkProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </Pressable>
  );
}
