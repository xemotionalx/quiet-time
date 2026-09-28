import { ActivityIndicator, Pressable, Text } from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function Button({ title, onPress, disabled, loading }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading}>
      {loading ? <ActivityIndicator /> : <Text>{title}</Text>}
    </Pressable>
  );
}
