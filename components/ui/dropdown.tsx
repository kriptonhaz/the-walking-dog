import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

const dropdownVariants = cva(
  'border rounded-input px-3 py-3 bg-white flex-row items-center justify-between',
  {
    variants: {
      variant: {
        default: 'border-neutral-300',
        error: 'border-red-500',
        success: 'border-green-500',
      },
      size: {
        sm: 'px-2 py-2',
        md: 'px-3 py-3',
        lg: 'px-4 py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface DropdownProps extends VariantProps<typeof dropdownVariants> {
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
  containerClassName?: string;
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
  variant,
  size,
  containerClassName = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Determine variant based on error/success state
  const currentVariant = error ? 'error' : success ? 'success' : variant || 'default';
  
  const dropdownClass = dropdownVariants({ variant: currentVariant, size });
  const focusedClass = isFocused && !error ? 'border-primary' : '';

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

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-sm font-medium text-text-primary mb-2">
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        className={`${dropdownClass} ${focusedClass} ${disabled ? 'opacity-50' : ''}`}
        onPress={handlePress}
        disabled={disabled}
        {...props}
      >
        <Text className={`flex-1 ${selectedOption ? 'text-text-primary' : 'text-neutral-400'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        
        <Text className={`text-neutral-400 ml-2 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </Text>
      </TouchableOpacity>
      
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

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={handleClose}
        >
          <View className="bg-white rounded-card mx-4 max-h-80 w-full max-w-sm shadow-lg">
            <View className="p-4 border-b border-neutral-200">
              <Text className="text-lg font-semibold text-text-primary">
                {label || 'Select Option'}
              </Text>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`p-4 border-b border-neutral-100 ${
                    item.value === value ? 'bg-primary/10' : ''
                  }`}
                  onPress={() => handleSelect(item)}
                >
                  <Text className={`text-base ${
                    item.value === value ? 'text-primary font-medium' : 'text-text-primary'
                  }`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: screenHeight * 0.4 }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Dropdown;