import { Text, TextInput, View, type TextInputProps } from "react-native";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, ...inputProps }: TextFieldProps) {
  return (
    <View>
      <Text>{label}</Text>
      <TextInput {...inputProps} />
      {error ? <Text>{error}</Text> : null}
    </View>
  );
}
