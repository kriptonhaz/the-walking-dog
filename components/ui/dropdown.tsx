import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Dimensions, StyleSheet } from 'react-native';
import { DesignSystemColors } from '@/constants/theme';

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value?: string | number;
  onSelect: (option: DropdownOption) => void;
  error?: string;
  success?: string;
  helperText?: string;
  disabled?: boolean;
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onSelect,
  error,
  success,
  helperText,
  disabled = false,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const screenHeight = Dimensions.get('window').height;

  const handlePress = () => {
    if (!disabled) {
      setIsOpen(true);
      setIsFocused(true);
    }
  };

  const handleSelect = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsFocused(false);
  };

  const getTriggerStyle = () => {
    let sizeStyle;
    let stateStyle;

    if (size === 'sm') sizeStyle = styles.triggerSm;
    else if (size === 'lg') sizeStyle = styles.triggerLg;
    else sizeStyle = styles.triggerMd;

    if (error) stateStyle = styles.triggerError;
    else if (success) stateStyle = styles.triggerSuccess;
    else if (isFocused) stateStyle = styles.triggerFocused;

    const disabledStyle = disabled ? styles.triggerDisabled : null;

    return [styles.trigger, sizeStyle, stateStyle, disabledStyle];
  };

  const getTextStyle = () => {
    return selectedOption ? styles.selectedText : styles.placeholderText;
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        style={getTriggerStyle()}
        onPress={handlePress}
        disabled={disabled}
        {...props}
      >
        <Text style={[styles.triggerText, getTextStyle()]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        
        <Text style={[styles.arrow, isOpen && styles.arrowRotated]}>
          ▼
        </Text>
      </TouchableOpacity>
      
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

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View style={[styles.modalContent, { maxHeight: screenHeight * 0.4 }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    index === options.length - 1 && styles.optionItemLast
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: DesignSystemColors.background.primary,
    borderWidth: 1,
    borderColor: DesignSystemColors.border.default,
    borderRadius: 8,
    minHeight: 40,
  },
  triggerSm: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  triggerMd: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  triggerLg: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  triggerError: {
    borderColor: DesignSystemColors.semantic.error,
  },
  triggerSuccess: {
    borderColor: DesignSystemColors.semantic.success,
  },
  triggerFocused: {
    borderColor: DesignSystemColors.primary[500],
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
  },
  selectedText: {
    color: DesignSystemColors.text.primary,
  },
  placeholderText: {
    color: DesignSystemColors.text.secondary,
  },
  arrow: {
    color: DesignSystemColors.text.secondary,
    marginLeft: 8,
    fontSize: 12,
  },
  arrowRotated: {
    transform: [{ rotate: '180deg' }],
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: DesignSystemColors.background.primary,
    borderRadius: 8,
    marginHorizontal: 20,
    maxWidth: 300,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  optionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DesignSystemColors.border.default,
  },
  optionItemLast: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 14,
    color: DesignSystemColors.text.primary,
  },
});

export default Dropdown;