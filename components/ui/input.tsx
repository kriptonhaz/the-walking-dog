import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'border rounded-input px-3 py-3 text-base text-text-primary bg-white',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 focus:border-primary',
        error: 'border-red-500',
        success: 'border-green-500',
      },
      size: {
        sm: 'px-2 py-2 text-sm',
        md: 'px-3 py-3 text-base',
        lg: 'px-4 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface InputProps extends Omit<TextInputProps, 'style'>, VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant,
  size,
  containerClassName = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Determine variant based on error/success state
  const currentVariant = error ? 'error' : success ? 'success' : variant || 'default';
  
  const inputClass = inputVariants({ variant: currentVariant, size });
  const focusedClass = isFocused && !error ? 'border-primary' : '';

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-sm font-medium text-text-primary mb-2">
          {label}
        </Text>
      )}
      
      <View className="relative">
        {leftIcon && (
          <View className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {leftIcon}
          </View>
        )}
        
        <TextInput
          className={`${inputClass} ${focusedClass} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {(error || success || helperText) && (
        <View className="mt-1">
          {error && (
            <Text className="text-sm text-red-500">
              {error}
            </Text>
          )}
          {success && !error && (
            <Text className="text-sm text-green-500">
              {success}
            </Text>
          )}
          {helperText && !error && !success && (
            <Text className="text-sm text-text-secondary">
              {helperText}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Input;