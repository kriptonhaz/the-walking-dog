import { DesignSystemColors } from "@/constants/theme";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";

// Define button styles using actual color values from design system
const getButtonStyle = (variant: string, size: string) => {
  const baseStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: 8,
  };

  const sizeStyles = {
    sm: { paddingHorizontal: 12, paddingVertical: 8 },
    md: { paddingHorizontal: 16, paddingVertical: 12 },
    lg: { paddingHorizontal: 24, paddingVertical: 16 },
  };

  const variantStyles = {
    primary: { backgroundColor: DesignSystemColors.primary[500] },
    secondary: { backgroundColor: DesignSystemColors.secondary[500] },
    outline: { 
      backgroundColor: 'transparent', 
      borderWidth: 1, 
      borderColor: DesignSystemColors.primary[500] 
    },
    ghost: { backgroundColor: 'transparent' },
    destructive: { backgroundColor: DesignSystemColors.semantic.error },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size as keyof typeof sizeStyles],
    ...variantStyles[variant as keyof typeof variantStyles],
  };
};

const getTextStyle = (variant: string, size: string) => {
  const baseStyle = {
    fontWeight: '500' as const,
    textAlign: 'center' as const,
  };

  const sizeStyles = {
    sm: { fontSize: 14 },
    md: { fontSize: 16 },
    lg: { fontSize: 18 },
  };

  const variantStyles = {
    primary: { color: DesignSystemColors.text.inverse },
    secondary: { color: DesignSystemColors.text.inverse },
    outline: { color: DesignSystemColors.primary[500] },
    ghost: { color: DesignSystemColors.primary[500] },
    destructive: { color: DesignSystemColors.text.inverse },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size as keyof typeof sizeStyles],
    ...variantStyles[variant as keyof typeof variantStyles],
  };
};

export interface ButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const buttonStyle = getButtonStyle(variant, size);
  const textStyleComputed = getTextStyle(variant, size);

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        disabled || loading ? { opacity: 0.5 } : {},
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? '#c97c41' : 'white'} 
        />
      ) : (
        <>
          {leftIcon}
          <Text style={[textStyleComputed, textStyle]}>
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;