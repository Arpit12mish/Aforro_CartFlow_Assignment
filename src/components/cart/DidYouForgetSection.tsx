import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { Radius } from '../../theme/radius';
import { Typography, FontWeight } from '../../theme/typography';
import { SuggestedProduct } from '../../features/cart/types/cart.types';
import { Product } from '../../features/cart/types/product.types';
import { QuantityStepper } from './QuantityStepper';
import { ProductOptionsBottomSheet } from './ProductOptionsBottomSheet';

type Props = {
  products: SuggestedProduct[];
  onPressProduct: (productId: string) => void;

  getQuantity: (product: SuggestedProduct) => number;
  onIncrease: (product: SuggestedProduct) => void;
  onDecrease: (product: SuggestedProduct) => void;

  resolveProductById: (productId: string) => Product | null;
  getInitialOptionQuantities: (product: Product) => Record<string, number>;
  onConfirmOptions: (
    product: Product,
    selectedQuantities: Record<string, number>,
  ) => void;
};

const RIBBON_WIDTH = 54;
const RIBBON_HEIGHT = 58;
const CUT_HEIGHT = 10;
const CUT_COUNT = 3;
const CUT_WIDTH = RIBBON_WIDTH / CUT_COUNT;
const RIBBON_COLOR = '#0F8AA8';

const DiscountRibbon = ({ label }: { label: string }) => {
  const formattedLabel = label.replace(' ', '\n');

  return (
    <View style={styles.discountRibbonWrap}>
      <View style={styles.discountRibbon}>
        <Text style={styles.discountRibbonText}>{formattedLabel}</Text>
      </View>

      <View style={styles.ribbonCutRow}>
        {Array.from({ length: CUT_COUNT }).map((_, index) => (
          <View key={index} style={styles.ribbonCutItem}>
            <View style={styles.ribbonCutInner} />
          </View>
        ))}
      </View>
    </View>
  );
};

export const DidYouForgetSection = ({
  products,
  onPressProduct,
  getQuantity,
  onIncrease,
  onDecrease,
  resolveProductById,
  getInitialOptionQuantities,
  onConfirmOptions,
}: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [initialQuantities, setInitialQuantities] = useState<
    Record<string, number>
  >({});

  if (!products.length) {
    return null;
  }

  const handleOpenOptions = (productId: string) => {
    const fullProduct = resolveProductById(productId);

    if (!fullProduct) {
      return;
    }

    setSelectedProduct(fullProduct);
    setInitialQuantities(getInitialOptionQuantities(fullProduct));
    setSheetVisible(true);
  };

  const handleCloseOptions = () => {
    setSheetVisible(false);
    setSelectedProduct(null);
    setInitialQuantities({});
  };

  const handleConfirmSheetOptions = (
    selectedQuantities: Record<string, number>,
  ) => {
    if (!selectedProduct) {
      return;
    }

    onConfirmOptions(selectedProduct, selectedQuantities);
    handleCloseOptions();
  };

  return (
    <>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Did you forget?</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {products.map(product => {
            const hasOptions = !!product.hasOptions;
            const quantity = getQuantity(product);

            return (
              <View key={product.id} style={styles.card}>
                <Pressable
                  style={styles.imageWrap}
                  onPress={() => onPressProduct(product.id)}
                >
                  {product.discountLabel ? (
                    <DiscountRibbon label={product.discountLabel} />
                  ) : null}

                  <Image source={{ uri: product.image }} style={styles.image} />
                </Pressable>

                <Pressable onPress={() => onPressProduct(product.id)}>
                  <Text style={styles.brand}>{product.brand}</Text>

                  <Text style={styles.name} numberOfLines={3}>
                    {product.name}
                  </Text>
                </Pressable>

                <Text style={styles.weight}>{product.weightLabel}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>₹{product.price}</Text>
                  {product.originalPrice ? (
                    <Text style={styles.originalPrice}>
                      ₹{product.originalPrice}
                    </Text>
                  ) : null}
                </View>

                {hasOptions ? (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleOpenOptions(product.id)}
                  >
                    <Text style={styles.actionButtonText}>2 options</Text>
                  </Pressable>
                ) : (
                  <QuantityStepper
                    quantity={quantity}
                    onIncrease={() => onIncrease(product)}
                    onDecrease={() => onDecrease(product)}
                  />
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <ProductOptionsBottomSheet
        visible={sheetVisible}
        product={selectedProduct}
        initialQuantities={initialQuantities}
        onClose={handleCloseOptions}
        onConfirm={handleConfirmSheetOptions}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  sectionTitle: {
    fontSize: Typography.title,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  listContent: {
    paddingRight: Spacing.md,
  },

  card: {
    width: 150,
    marginRight: Spacing.md,
  },

  imageWrap: {
    position: 'relative',
    height: 120,
    borderRadius: Radius.md,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },

  discountRibbonWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    width: RIBBON_WIDTH,
    alignItems: 'flex-start',
  },

  discountRibbon: {
    width: RIBBON_WIDTH,
    height: RIBBON_HEIGHT,
    backgroundColor: RIBBON_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },

  discountRibbonText: {
    color: Colors.white,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
    textAlign: 'center',
  },

  ribbonCutRow: {
    flexDirection: 'row',
    width: RIBBON_WIDTH,
    height: CUT_HEIGHT,
    marginTop: -1,
  },

  ribbonCutItem: {
    width: CUT_WIDTH,
    height: CUT_HEIGHT,
    backgroundColor: RIBBON_COLOR,
    overflow: 'hidden',
    position: 'relative',
  },

  ribbonCutInner: {
    position: 'absolute',
    width: CUT_WIDTH,
    height: CUT_WIDTH,
    backgroundColor: '#F9F9F9',
    left: '50%',
    marginLeft: -(CUT_WIDTH / 2),
    bottom: -(CUT_WIDTH / 2),
    transform: [{ rotate: '45deg' }],
  },

  image: {
    width: 84,
    height: 84,
    resizeMode: 'contain',
  },

  brand: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },

  name: {
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    minHeight: 60,
    marginBottom: Spacing.xs,
  },

  weight: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },

  price: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  originalPrice: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },

  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    minHeight: 42,
  },

  actionButtonText: {
    color: Colors.white,
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
  },
});