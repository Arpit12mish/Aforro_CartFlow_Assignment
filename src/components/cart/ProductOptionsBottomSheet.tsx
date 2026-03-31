import React, { useEffect, useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/radius';
import { Spacing } from '../../theme/spacing';
import { FontWeight, Typography } from '../../theme/typography';
import { Product, ProductVariant } from '../../features/cart/types/product.types';
import { QuantityStepper } from './QuantityStepper';

type Props = {
  visible: boolean;
  product: Product | null;
  initialQuantities?: Record<string, number>;
  onClose: () => void;
  onConfirm: (selectedQuantities: Record<string, number>) => void;
};

export const ProductOptionsBottomSheet = ({
  visible,
  product,
  initialQuantities = {},
  onClose,
  onConfirm,
}: Props) => {
  const [selectedOptionQuantities, setSelectedOptionQuantities] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!visible || !product) {
      return;
    }

    const nextQuantities: Record<string, number> = {};

    product.variants.forEach(variant => {
      nextQuantities[variant.id] = initialQuantities[variant.id] ?? 0;
    });

    setSelectedOptionQuantities(nextQuantities);
  }, [visible, product, initialQuantities]);

  const updateOptionQuantity = (variantId: string, type: 'inc' | 'dec') => {
    setSelectedOptionQuantities(prev => {
      const current = prev[variantId] ?? 0;
      const nextValue = type === 'inc' ? current + 1 : Math.max(current - 1, 0);

      return {
        ...prev,
        [variantId]: nextValue,
      };
    });
  };

  const selectedOptionCount = useMemo(
    () =>
      Object.values(selectedOptionQuantities).reduce(
        (sum, quantity) => sum + quantity,
        0,
      ),
    [selectedOptionQuantities],
  );

  const handleConfirm = () => {
    onConfirm(selectedOptionQuantities);
  };

  const renderVariantRow = (variant: ProductVariant) => {
    const quantity = selectedOptionQuantities[variant.id] ?? 0;

    return (
      <View key={variant.id} style={styles.sheetItemRow}>
        <View style={styles.sheetItemLeft}>
          <Image
            source={{ uri: product?.image }}
            style={styles.sheetItemImage}
          />

          <View style={styles.sheetItemTextWrap}>
            <Text numberOfLines={2} style={styles.sheetItemName}>
              {product?.name}
            </Text>

            <Text style={styles.sheetItemMeta}>
              {variant.label} • {variant.weightLabel}
            </Text>

            <View style={styles.sheetPriceRow}>
              <Text style={styles.sheetPriceText}>₹{variant.price}</Text>
              {variant.originalPrice ? (
                <Text style={styles.sheetOriginalPriceText}>
                  ₹{variant.originalPrice}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.sheetStepperWrap}>
          <QuantityStepper
            quantity={quantity}
            onIncrease={() => updateOptionQuantity(variant.id, 'inc')}
            onDecrease={() => updateOptionQuantity(variant.id, 'dec')}
            disabled={!variant.inStock}
          />
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.sheetOverlay}>
        <Pressable style={styles.sheetBackdrop} onPress={onClose} />

        <View style={styles.sheetContainer}>
          <View style={styles.sheetHandle} />

          <Text numberOfLines={2} style={styles.sheetProductTitle}>
            {product?.name}
          </Text>

          <Text style={styles.sheetSubtitle}>
            Select quantities and confirm
          </Text>

          {product?.variants.map(renderVariantRow)}

          <Pressable
            style={[
              styles.confirmButton,
              selectedOptionCount === 0 && styles.confirmButtonDisabled,
            ]}
            disabled={selectedOptionCount === 0}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.overlay,
  },

  sheetBackdrop: {
    flex: 1,
  },

  sheetContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: Radius.pill,
    backgroundColor: '#D4D4D4',
    marginBottom: Spacing.md,
  },

  sheetProductTitle: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },

  sheetSubtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },

  sheetItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },

  sheetItemLeft: {
    flexDirection: 'row',
    flex: 1,
  },

  sheetItemImage: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    marginRight: Spacing.md,
  },

  sheetItemTextWrap: {
    flex: 1,
  },

  sheetItemName: {
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },

  sheetItemMeta: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  sheetPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  sheetPriceText: {
    fontSize: Typography.body,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  sheetOriginalPriceText: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },

  sheetStepperWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },

  confirmButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },

  confirmButtonDisabled: {
    backgroundColor: Colors.disabled,
  },

  confirmButtonText: {
    color: Colors.white,
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
  },
});