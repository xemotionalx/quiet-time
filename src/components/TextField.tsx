import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

import { Icon } from "./Icon";
import { colors, radius, size, space, strokeWidth, type } from "@/theme/tokens";

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  disabled?: boolean;
};

export function TextField({
  label,
  error,
  disabled,
  secureTextEntry,
  onFocus,
  onBlur,
  style,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValueVisible, setIsValueVisible] = useState(false);
  const isPassword = !!secureTextEntry;

  useEffect(() => {
    if (error) {
      AccessibilityInfo.announceForAccessibility(error);
    }
  }, [error]);

  return (
    <View>
      <Text style={[styles.fieldLabel, disabled && styles.fieldLabelDisabled]}>
        {label}
      </Text>
      <View
        style={[
          styles.focusRing,
          isFocused && !disabled && styles.focusRingActive,
        ]}
      >
        <View
          style={[
            styles.inputWrapper,
            error && styles.inputWrapperError,
            disabled && styles.inputWrapperDisabled,
          ]}
        >
          <TextInput
            {...inputProps}
            secureTextEntry={isPassword && !isValueVisible}
            editable={!disabled}
            selectionColor={colors.chalk}
            placeholderTextColor={colors.smoke}
            accessibilityLabel={
              inputProps.accessibilityLabel ??
              (error ? `${label}. Error: ${error}` : label)
            }
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            style={[styles.input, disabled && styles.inputDisabled, style]}
          />
          {isPassword ? (
            <Pressable
              onPress={() => setIsValueVisible((visible) => !visible)}
              disabled={disabled}
              style={styles.toggle}
              accessibilityRole="button"
              accessibilityLabel={
                isValueVisible ? "Hide password" : "Show password"
              }
            >
              <Icon
                name={isValueVisible ? "eye-off" : "eye"}
                size={22}
                strokeWidth={2}
                color={disabled ? colors.smoke : colors.chalk}
              />
            </Pressable>
          ) : null}
        </View>
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Icon name="alert" size={16} strokeWidth={2} color={colors.chalk} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: type.label.fontSize,
    lineHeight: type.label.lineHeight,
    fontWeight: type.label.fontWeight,
    color: colors.chalk,
    marginBottom: space.space2,
  },
  fieldLabelDisabled: {
    color: colors.smoke,
  },
  // Reserves the double-line focus ring's space (transparent border) so
  // nothing shifts when the field gains focus.
  focusRing: {
    padding: strokeWidth,
    borderWidth: strokeWidth,
    borderRadius: radius.input + strokeWidth * 2,
    borderColor: "transparent",
  },
  focusRingActive: {
    borderColor: colors.chalk,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: size.controlInput,
    borderRadius: radius.input,
    borderWidth: strokeWidth,
    borderColor: colors.chalk,
    backgroundColor: colors.ink,
  },
  inputWrapperError: {
    borderStyle: "dashed",
  },
  inputWrapperDisabled: {
    borderColor: colors.ash,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: space.space4,
    fontSize: type.body.fontSize,
    color: colors.chalk,
  },
  inputDisabled: {
    color: colors.smoke,
  },
  toggle: {
    width: size.touchMin,
    height: size.touchMin,
    alignItems: "center",
    justifyContent: "center",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.space2 / 2,
    marginTop: space.space2,
  },
  errorText: {
    fontSize: type.fieldMessage.fontSize,
    lineHeight: type.fieldMessage.lineHeight,
    fontWeight: type.fieldMessage.fontWeight,
    color: colors.chalk,
  },
});
