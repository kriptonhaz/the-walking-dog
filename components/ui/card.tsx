import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  'rounded-card bg-white border border-neutral-200 shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-white border-neutral-200',
        elevated: 'bg-white border-neutral-200 shadow-md',
        outlined: 'bg-transparent border-2 border-primary',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface CardProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant,
  padding,
  ...props
}) => {
  const cardClass = cardVariants({ variant, padding });

  if (onPress) {
    return (
      <TouchableOpacity
        className={`${cardClass} active:opacity-95`}
        onPress={onPress}
        style={style}
        activeOpacity={0.95}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View className={cardClass} style={style} {...props}>
      {children}
    </View>
  );
};

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <View className={`mb-4 ${className}`}>
    {children}
  </View>
);

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <Text className={`text-lg font-semibold text-text-primary mb-1 ${className}`}>
    {children}
  </Text>
);

export interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => (
  <Text className={`text-sm text-text-secondary ${className}`}>
    {children}
  </Text>
);

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <View className={className}>
    {children}
  </View>
);

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <View className={`mt-4 flex-row justify-end ${className}`}>
    {children}
  </View>
);

export default Card;