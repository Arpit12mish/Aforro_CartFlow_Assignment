import React, { useMemo, useState } from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Address'>;

export const AddressScreen = ({ navigation }: Props) => {
  const setAddress = useCartStore(state => state.setAddress);
  const setDeliveryMode = useCartStore(state => state.setDeliveryMode);

  const [isMarkedServiceable, setIsMarkedServiceable] = useState(false);
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState<
    'slot' | 'instant'
  >('slot');

  const demoAddress = useMemo(
    () => ({
      id: 'addr-demo-1',
      title: 'Deliver to Home',
      addressLine: 'Plot no.10, Khasra no.873, Rawli Mehd...',
      serviceable: isMarkedServiceable,
    }),
    [isMarkedServiceable],
  );

  const handleUseCurrentDemoAddress = () => {
    setAddress(demoAddress);
    setDeliveryMode(selectedDeliveryMode);
    navigation.goBack();
  };

  const handleSetNonServiceable = () => {
    setAddress({
      ...demoAddress,
      serviceable: false,
    });
    setDeliveryMode(selectedDeliveryMode);
    navigation.goBack();
  };

  const handleSetServiceable = () => {
    setAddress({
      ...demoAddress,
      serviceable: true,
    });
    setDeliveryMode(selectedDeliveryMode);
    navigation.goBack();
  };

  const handleClearAddress = () => {
    setAddress(null);
    setDeliveryMode('slot');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.screenBackground}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Select Address</Text>
        <Text style={styles.subtitle}>
          Demo flow for assignment review. Reviewer can test:
          {'\n'}1. serviceable / not serviceable
          {'\n'}2. slot delivery / instant delivery
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Demo address</Text>
              <Text style={styles.cardText}>{demoAddress.title}</Text>
              <Text style={styles.cardSubtext}>{demoAddress.addressLine}</Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                demoAddress.serviceable
                  ? styles.statusBadgeSuccess
                  : styles.statusBadgeDanger,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  demoAddress.serviceable
                    ? styles.statusBadgeTextSuccess
                    : styles.statusBadgeTextDanger,
                ]}
              >
                {demoAddress.serviceable ? 'Serviceable' : 'Not serviceable'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Serviceability</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[
                styles.toggleButton,
                !isMarkedServiceable && styles.toggleButtonActive,
              ]}
              onPress={() => setIsMarkedServiceable(false)}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  !isMarkedServiceable && styles.toggleButtonTextActive,
                ]}
              >
                Non-serviceable
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.toggleButton,
                isMarkedServiceable && styles.toggleButtonActive,
              ]}
              onPress={() => setIsMarkedServiceable(true)}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  isMarkedServiceable && styles.toggleButtonTextActive,
                ]}
              >
                Serviceable
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>Delivery mode</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[
                styles.toggleButton,
                selectedDeliveryMode === 'slot' && styles.toggleButtonActive,
              ]}
              onPress={() => setSelectedDeliveryMode('slot')}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  selectedDeliveryMode === 'slot' &&
                    styles.toggleButtonTextActive,
                ]}
              >
                Slot delivery
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.toggleButton,
                selectedDeliveryMode === 'instant' && styles.toggleButtonActive,
              ]}
              onPress={() => setSelectedDeliveryMode('instant')}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  selectedDeliveryMode === 'instant' &&
                    styles.toggleButtonTextActive,
                ]}
              >
                Instant delivery
              </Text>
            </Pressable>
          </View>

          <View style={styles.previewBox}>
            <Text style={styles.previewLabel}>Current demo state</Text>
            <Text style={styles.previewText}>
              {demoAddress.serviceable ? 'Serviceable' : 'Not serviceable'} •{' '}
              {selectedDeliveryMode === 'instant'
                ? 'Instant delivery'
                : 'Slot delivery'}
            </Text>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={handleUseCurrentDemoAddress}
          >
            <Text style={styles.primaryButtonText}>
              Use current demo state
            </Text>
          </Pressable>

          <View style={styles.quickActionsRow}>
            <Pressable
              style={[styles.secondaryActionButton, styles.dangerActionButton]}
              onPress={handleSetNonServiceable}
            >
              <Text
                style={[
                  styles.secondaryActionButtonText,
                  styles.dangerActionButtonText,
                ]}
              >
                Use as non-serviceable
              </Text>
            </Pressable>

            <Pressable
              style={[styles.secondaryActionButton, styles.successActionButton]}
              onPress={handleSetServiceable}
            >
              <Text
                style={[
                  styles.secondaryActionButtonText,
                  styles.successActionButtonText,
                ]}
              >
                Mark serviceable and use
              </Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.clearButton} onPress={handleClearAddress}>
          <Text style={styles.clearButtonText}>Clear address</Text>
        </Pressable>
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
  },
  title: {
    fontSize: Typography.title,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardHeaderRow: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  cardText: {
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardSubtext: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  statusBadgeSuccess: {
    backgroundColor: '#EAF7EE',
  },
  statusBadgeDanger: {
    backgroundColor: '#FDEBEC',
  },
  statusBadgeText: {
    fontSize: Typography.caption,
    fontWeight: FontWeight.bold,
  },
  statusBadgeTextSuccess: {
    color: Colors.success,
  },
  statusBadgeTextDanger: {
    color: Colors.danger,
  },
  sectionLabel: {
    fontSize: Typography.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  toggleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  toggleButtonText: {
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  toggleButtonTextActive: {
    color: Colors.primaryDark,
  },
  previewBox: {
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  previewLabel: {
    fontSize: Typography.caption,
    fontWeight: FontWeight.bold,
    color: Colors.infoText,
    marginBottom: Spacing.xs,
  },
  previewText: {
    fontSize: Typography.body,
    color: Colors.infoText,
    fontWeight: FontWeight.semibold,
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
  quickActionsRow: {
    gap: Spacing.md,
  },
  secondaryActionButton: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  secondaryActionButtonText: {
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
  },
  dangerActionButton: {
    borderColor: '#F4C7CB',
    backgroundColor: '#FFF6F7',
    marginBottom: Spacing.md,
  },
  dangerActionButtonText: {
    color: Colors.danger,
  },
  successActionButton: {
    borderColor: '#B8DEC1',
    backgroundColor: '#F3FBF5',
  },
  successActionButtonText: {
    color: Colors.success,
  },
  clearButton: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  clearButtonText: {
    color: Colors.textPrimary,
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
  },
});