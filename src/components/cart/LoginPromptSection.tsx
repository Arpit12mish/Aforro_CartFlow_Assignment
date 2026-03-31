import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Radius } from '../../theme/radius';
import { Typography, FontWeight } from '../../theme/typography';

type Props = {
  onPressLogin: () => void;
};

export const LoginPromptSection = ({ onPressLogin }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to proceed</Text>
      <Text style={styles.subtitle}>
        Log in or sign up to proceed with your order
      </Text>

      <Pressable style={styles.loginButton} onPress={onPressLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.heading,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
  },
});