'use client';

import React, { useState, useRef, useEffect } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  step?: number;
  min?: number;
  max?: number;
}

export default function NumberInput({
  value,
  onChange,
  placeholder = '',
  className = '',
  label,
  step,
  min,
  max
}: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [rawValue, setRawValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Format number - add thousand separators
  const formatNumber = (num: string | number): string => {
    if (num === '' || num === null || num === undefined) return '';
    // Remove all non-digit characters
    const cleanNum = num.toString().replace(/[^\d]/g, '');
    if (cleanNum === '') return '';
    // Add thousand separators
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Remove formatting - get pure numbers
  const unformatNumber = (formattedNum: string): string => {
    if (!formattedNum) return '';
    return formattedNum.toString().replace(/[^\d]/g, '');
  };

  // Initialize display value when component mounts or value prop changes
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setRawValue(value.toString());
      setDisplayValue(formatNumber(value.toString()));
    }
  }, [value]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    // If input is empty, clear all values
    if (inputValue === '') {
      setDisplayValue('');
      setRawValue('');
      onChange(0);
      return;
    }

    // Get pure numeric value
    const rawNum = unformatNumber(inputValue);
    
    // Limit maximum length (12 digits)
    if (rawNum.length <= 12) {
      let numericValue = parseInt(rawNum, 10) || 0;
      
      // Apply min/max constraints if provided
      if (min !== undefined && numericValue < min) {
        numericValue = min;
      }
      if (max !== undefined && numericValue > max) {
        numericValue = max;
      }
      
      setRawValue(rawNum);
      onChange(numericValue);
      
      // Format display value
      const formatted = formatNumber(rawNum);
      setDisplayValue(formatted);
      
      // Calculate new cursor position
      setTimeout(() => {
        if (inputRef.current) {
          const oldLength = inputValue.length;
          const newLength = formatted.length;
          const newPosition = (cursorPosition || 0) + (newLength - oldLength);
          inputRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allowed control keys
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
      'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End'
    ];
    
    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    const isNumber = /^[0-9]$/.test(e.key);
    const isAllowedKey = allowedKeys.includes(e.key);
    
    if (!isNumber && !isAllowedKey) {
      e.preventDefault();
    }
  };

  // Handle focus events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // If value is empty, select all content for easy replacement
    if (rawValue === '' || displayValue === '') {
      setTimeout(() => {
        e.target.select();
      }, 0);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || (window as any).clipboardData).getData('text');
    const numbersOnly = pastedText.replace(/[^\d]/g, '');
    
    if (numbersOnly && numbersOnly.length <= 12) {
      let numericValue = parseInt(numbersOnly, 10) || 0;
      
      // Apply min/max constraints
      if (min !== undefined && numericValue < min) {
        numericValue = min;
      }
      if (max !== undefined && numericValue > max) {
        numericValue = max;
      }
      
      setRawValue(numbersOnly);
      setDisplayValue(formatNumber(numbersOnly));
      onChange(numericValue);
    }
  };

  const inputClasses = `
    w-full px-3 py-2 border-2 rounded-lg transition-all
    ${isFocused 
      ? 'border-blue-500 ring-2 ring-blue-200' 
      : 'border-gray-300 hover:border-gray-400'
    }
    focus:outline-none font-mono text-right
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onPaste={handlePaste}
        placeholder={placeholder || "Enter amount"}
        className={inputClasses}
        inputMode="numeric"
        pattern="[0-9,]*"
      />
    </div>
  );
}
