import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';

import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/radius';
import { Spacing } from '../../theme/spacing';
import { FontWeight } from '../../theme/typography';

type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
};

export const QuantityStepper = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
}: Props) => {
  if (quantity <= 0) {
    return (
      <Pressable
        style={[styles.addButton, disabled && styles.addButtonDisabled]}
        onPress={onIncrease}
        disabled={disabled}
      >
        <Text style={[styles.addButtonText, disabled && styles.addButtonTextDisabled]}>
          Add
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <Pressable
        onPress={onDecrease}
        hitSlop={Spacing.md}
        style={styles.iconButton}
        disabled={disabled}
      >
        <Minus
          size={14}
          color={disabled ? Colors.textMuted : Colors.primary}
        />
      </Pressable>

      <Text style={[styles.text, disabled && styles.textDisabled]}>
        {quantity}
      </Text>

      <Pressable
        onPress={onIncrease}
        hitSlop={Spacing.md}
        style={styles.iconButton}
        disabled={disabled}
      >
        <Plus
          size={14}
          color={disabled ? Colors.textMuted : Colors.primary}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 102,
    height: 42,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
  },

  iconButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: FontWeight.medium,
    color: Colors.primary,
  },

  textDisabled: {
    color: Colors.textMuted,
  },

  addButton: {
    minWidth: 102,
    height: 42,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonDisabled: {
    backgroundColor: Colors.disabled,
  },

  addButtonText: {
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  addButtonTextDisabled: {
    color: Colors.textSecondary,
  },
});