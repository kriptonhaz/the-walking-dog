import { DesignSystemColors } from "@/constants/theme";
import React from "react";
import { Button as TamaguiButton, ButtonProps as TamaguiButtonProps } from "tamagui";
import { ActivityIndicator } from "react-native";

export interface ButtonProps extends Omit<TamaguiButtonProps, 'size' | 'variant'> {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
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
  leftIcon,
  rightIcon,
  ...props
}) => {
  const getTheme = () => {
    switch (variant) {
      case 'primary':
        return 'accent';
      case 'secondary':
        return undefined;
      case 'outline':
        return 'accent';
      case 'ghost':
        return undefined;
      case 'destructive':
        return 'error';
      default:
        return 'accent';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return '$3';
      case 'md':
        return '$4';
      case 'lg':
        return '$5';
      default:
        return '$4';
    }
  };

  const getTamaguiVariant = () => {
    switch (variant) {
      case 'outline':
        return 'outlined';
      default:
        return undefined;
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {};
    }
  };

  return (
    <TamaguiButton
      theme={getTheme()}
      variant={getTamaguiVariant()}
      size={getSize()}
      onPress={onPress}
      disabled={disabled || loading}
      {...getVariantStyle()}
      {...props}
    >
      {loading && <ActivityIndicator size="small" color="white" />}
      {!loading && leftIcon && leftIcon}
      {!loading && title}
      {!loading && rightIcon && rightIcon}
    </TamaguiButton>
  );
};

export default Button;