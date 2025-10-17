import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { DesignSystemColors } from '@/constants/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyle = () => {
    let sizeStyle;
    let stateStyle;
    let iconStyle = {};

    if (size === 'sm') sizeStyle = styles.inputSm;
    else if (size === 'lg') sizeStyle = styles.inputLg;
    else sizeStyle = styles.inputMd;

    if (error) stateStyle = styles.inputError;
    else if (success) stateStyle = styles.inputSuccess;
    else if (isFocused) stateStyle = styles.inputFocused;

    if (leftIcon) iconStyle = { ...iconStyle, ...styles.inputWithLeftIcon };
    if (rightIcon) iconStyle = { ...iconStyle, ...styles.inputWithRightIcon };

    return [styles.input, sizeStyle, stateStyle, iconStyle];
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), style]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={DesignSystemColors.text.secondary}
          {...props}
        />
        
        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {(error || success || helperText) && (
        <View style={styles.messageContainer}>
          {error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}
          {success && (
            <Text style={styles.successText}>
              {success}
            </Text>
          )}
          {helperText && !error && !success && (
            <Text style={styles.helperText}>
              {helperText}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: DesignSystemColors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: DesignSystemColors.background.primary,
    borderWidth: 1,
    borderColor: DesignSystemColors.border.default,
    borderRadius: 8,
    fontSize: 14,
    color: DesignSystemColors.text.primary,
  },
  inputSm: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 32,
  },
  inputMd: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 40,
  },
  inputLg: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 48,
  },
  inputError: {
    borderColor: DesignSystemColors.semantic.error,
  },
  inputSuccess: {
    borderColor: DesignSystemColors.semantic.success,
  },
  inputFocused: {
    borderColor: DesignSystemColors.primary[500],
  },
  inputWithLeftIcon: {
    paddingLeft: 40,
  },
  inputWithRightIcon: {
    paddingRight: 40,
  },
  leftIconContainer: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 10,
  },
  rightIconContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  messageContainer: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: DesignSystemColors.semantic.error,
  },
  successText: {
    fontSize: 12,
    color: DesignSystemColors.semantic.success,
  },
  helperText: {
    fontSize: 12,
    color: DesignSystemColors.text.secondary,
  },
});

export default Input;