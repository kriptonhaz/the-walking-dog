import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewProps } from 'react-native';
import { DesignSystemColors } from '@/constants/theme';

export interface AlertProps extends ViewProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  title,
  description,
  icon,
  onClose,
  children,
  style,
  ...props
}) => {
  const getAlertStyle = () => {
    let variantStyle;
    
    switch (variant) {
      case 'destructive':
        variantStyle = styles.alertDestructive;
        break;
      case 'success':
        variantStyle = styles.alertSuccess;
        break;
      case 'warning':
        variantStyle = styles.alertWarning;
        break;
      default:
        variantStyle = styles.alertDefault;
    }
    
    return [styles.alert, variantStyle];
  };

  const getTitleStyle = () => {
    switch (variant) {
      case 'destructive':
        return styles.titleDestructive;
      case 'success':
        return styles.titleSuccess;
      case 'warning':
        return styles.titleWarning;
      default:
        return styles.titleDefault;
    }
  };

  const getDescriptionStyle = () => {
    switch (variant) {
      case 'destructive':
        return styles.descriptionDestructive;
      case 'success':
        return styles.descriptionSuccess;
      case 'warning':
        return styles.descriptionWarning;
      default:
        return styles.descriptionDefault;
    }
  };

  return (
    <View style={[getAlertStyle(), style]} {...props}>
      {icon && (
        <View style={styles.iconContainer}>
          {icon}
        </View>
      )}
      
      <View style={styles.contentContainer}>
        {title && (
          <Text style={[styles.title, getTitleStyle()]}>
            {title}
          </Text>
        )}
        {description && (
          <Text style={[styles.description, getDescriptionStyle()]}>
            {description}
          </Text>
        )}
        {children}
      </View>
      
      {onClose && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  alertDefault: {
    backgroundColor: DesignSystemColors.background.primary,
    borderColor: DesignSystemColors.border.default,
  },
  alertDestructive: {
    backgroundColor: '#fef2f2',
    borderColor: DesignSystemColors.semantic.error,
  },
  alertSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: DesignSystemColors.semantic.success,
  },
  alertWarning: {
    backgroundColor: '#fffbeb',
    borderColor: DesignSystemColors.semantic.warning,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleDefault: {
    color: DesignSystemColors.text.primary,
  },
  titleDestructive: {
    color: DesignSystemColors.semantic.error,
  },
  titleSuccess: {
    color: DesignSystemColors.semantic.success,
  },
  titleWarning: {
    color: DesignSystemColors.semantic.warning,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  descriptionDefault: {
    color: DesignSystemColors.text.secondary,
  },
  descriptionDestructive: {
    color: '#dc2626',
  },
  descriptionSuccess: {
    color: '#16a34a',
  },
  descriptionWarning: {
    color: '#d97706',
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  closeButtonText: {
    color: DesignSystemColors.text.secondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Alert;