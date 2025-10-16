import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

const alertVariants = cva(
  'rounded-card p-4 border flex-row items-start',
  {
    variants: {
      variant: {
        default: 'bg-neutral-50 border-neutral-200',
        success: 'bg-green-50 border-green-200',
        warning: 'bg-yellow-50 border-yellow-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const titleVariants = cva(
  'font-semibold text-sm mb-1',
  {
    variants: {
      variant: {
        default: 'text-neutral-900',
        success: 'text-green-900',
        warning: 'text-yellow-900',
        error: 'text-red-900',
        info: 'text-blue-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const descriptionVariants = cva(
  'text-sm',
  {
    variants: {
      variant: {
        default: 'text-neutral-700',
        success: 'text-green-700',
        warning: 'text-yellow-700',
        error: 'text-red-700',
        info: 'text-blue-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AlertProps extends VariantProps<typeof alertVariants> {
  title?: string;
  description: string;
  onClose?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  onClose,
  icon,
  variant,
  ...props
}) => {
  const alertClass = alertVariants({ variant });
  const titleClass = titleVariants({ variant });
  const descriptionClass = descriptionVariants({ variant });

  return (
    <View className={alertClass} {...props}>
      {icon && (
        <View className="mr-3 mt-0.5">
          {icon}
        </View>
      )}
      
      <View className="flex-1">
        {title && (
          <Text className={titleClass}>
            {title}
          </Text>
        )}
        <Text className={descriptionClass}>
          {description}
        </Text>
      </View>

      {onClose && (
        <TouchableOpacity
          onPress={onClose}
          className="ml-3 p-1"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-neutral-400 text-lg font-bold">×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Alert;