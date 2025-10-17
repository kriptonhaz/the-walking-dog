import React from 'react';
import { View, ViewProps, StyleSheet, Text, TextProps } from 'react-native';
import { DesignSystemColors } from '@/constants/theme';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const styles = StyleSheet.create({
  cardDefault: {
    backgroundColor: DesignSystemColors.background.primary,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: DesignSystemColors.border.default,
    borderRadius: 12,
  },
  cardGhost: {
    backgroundColor: 'transparent',
    borderRadius: 12,
  },
  paddingNone: {
    padding: 0,
  },
  paddingSm: {
    padding: 12,
  },
  paddingMd: {
    padding: 16,
  },
  paddingLg: {
    padding: 24,
  },
});

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  style,
  children,
  ...props
}) => {
  const baseStyle = variant === 'default' ? styles.cardDefault :
                   variant === 'outline' ? styles.cardOutline :
                   styles.cardGhost;
  
  const paddingStyle = padding === 'none' ? styles.paddingNone :
                      padding === 'sm' ? styles.paddingSm :
                      padding === 'md' ? styles.paddingMd :
                      styles.paddingLg;

  return (
    <View style={[baseStyle, paddingStyle, style]} {...props}>
      {children}
    </View>
  );
};

export interface CardHeaderProps extends ViewProps {
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  style,
  children,
  ...props
}) => {
  const headerStyle = [
    {
      marginBottom: 16,
    },
    style,
  ];

  return (
    <View style={headerStyle} {...props}>
      {children}
    </View>
  );
};

export interface CardTitleProps extends TextProps {
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  style,
  children,
  ...props
}) => {
  const titleStyle = [
    {
      fontSize: 18,
      fontWeight: '600' as const,
      color: DesignSystemColors.text.primary,
      marginBottom: 4,
    },
    style,
  ];

  return (
    <Text style={titleStyle} {...props}>
      {children}
    </Text>
  );
};

export interface CardDescriptionProps extends TextProps {
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  style,
  children,
  ...props
}) => {
  const descriptionStyle = [
    {
      fontSize: 14,
      color: DesignSystemColors.text.secondary,
    },
    style,
  ];

  return (
    <Text style={descriptionStyle} {...props}>
      {children}
    </Text>
  );
};

export interface CardContentProps extends ViewProps {
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

export interface CardFooterProps extends ViewProps {
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  style,
  children,
  ...props
}) => {
  const footerStyle = [
    {
      marginTop: 16,
      flexDirection: 'row' as const,
      justifyContent: 'flex-end' as const,
    },
    style,
  ];

  return (
    <View style={footerStyle} {...props}>
      {children}
    </View>
  );
};