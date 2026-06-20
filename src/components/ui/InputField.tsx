import { FieldLabel } from "@/src/components/ui/FieldLabel";
import { useTheme } from "@/src/hooks/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputProps,
} from "react-native";

type InputFieldProps = TextInputProps & {
  label: string;
  isPassword?: boolean;
};

export function InputField({
  label,
  style,
  isPassword,
  ...rest
}: InputFieldProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={styles.fieldContainer}>
      <FieldLabel>{label}</FieldLabel>

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderColor: isFocused ? colors.primary : "transparent",
            borderWidth: 1.5,
          },
        ]}
      >
        <TextInput
          {...rest}
          secureTextEntry={
            isPassword ? !isPasswordVisible : rest.secureTextEntry
          }
          placeholderTextColor={colors.muted}
          onFocus={(e) => {
            setIsFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            rest.onBlur?.(e);
          }}
          style={[styles.input, { color: colors.text }]}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={22}
              color={colors.muted}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 15,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
