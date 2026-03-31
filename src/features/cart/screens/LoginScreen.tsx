import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/AppNavigator';
import { useCartStore } from '../store/cartStore';
import { Colors } from '../../../theme/colors';
import { Spacing } from '../../../theme/spacing';
import { Radius } from '../../../theme/radius';
import { Typography, FontWeight } from '../../../theme/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const setLoggedIn = useCartStore(state => state.setLoggedIn);

  const handleLogin = () => {
    setLoggedIn(true);
    navigation.goBack();
  };

  const handleContinueAsGuest = () => {
    setLoggedIn(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.screenBackground}
      />

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>
            Demo login screen for assignment flow. Use this to test the
            logged-in and not-logged-in cart states.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Demo behavior</Text>
            <Text style={styles.infoText}>
              Tap login to mark the user as logged in and return to the cart.
            </Text>
          </View>

          <Pressable style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>Login</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={handleContinueAsGuest}
          >
            <Text style={styles.secondaryButtonText}>Stay logged out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
  },
  title: {
    fontSize: Typography.title,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  infoBox: {
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoTitle: {
    fontSize: Typography.body,
    fontWeight: FontWeight.bold,
    color: Colors.infoText,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.caption,
    color: Colors.infoText,
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
  },
});