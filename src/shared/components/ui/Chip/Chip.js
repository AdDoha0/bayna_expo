import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip as PaperChip } from 'react-native-paper';

export function Chip({ 
  children, 
  style, 
  textStyle,
  backgroundColor,
  textColor,
  mode = "flat",
  ...props 
}) {
  return (
    <PaperChip
      mode={mode}
      textStyle={[styles.chipText, textStyle]}
      style={[
        styles.chip, 
        backgroundColor && { backgroundColor },
        style
      ]}
      textColor={textColor}
      {...props}
    >
      {children}
    </PaperChip>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

