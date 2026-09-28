import { Text } from "react-native";

type ErrorMessageProps = {
  message?: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  return <Text>{message}</Text>;
}
