import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/radius';
import { Spacing } from '../../theme/spacing';
import { FontWeight, Typography } from '../../theme/typography';
import {
  Product,
  ProductListItem,
} from '../../features/cart/types/product.types';
import { ProductSuggestionCard } from './ProductSuggestionCard';
import { ProductOptionsBottomSheet } from '../cart/ProductOptionsBottomSheet';

type Props = {
  title: string;
  products: ProductListItem[];
  getQuantity: (item: ProductListItem) => number;
  onPressCard: (item: ProductListItem) => void;
  onIncrease: (item: ProductListItem) => void;
  onDecrease: (item: ProductListItem) => void;

  resolveProductById: (productId: string) => Product | null;
  getInitialOptionQuantities: (product: Product) => Record<string, number>;
  onConfirmOptions: (
    product: Product,
    selectedQuantities: Record<string, number>,
  ) => void;
};

export const ProductSuggestionSection = ({
  title,
  products,
  getQuantity,
  onPressCard,
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

  const handleOpenOptions = (item: ProductListItem) => {
    const fullProduct = resolveProductById(item.id);

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

  const handleConfirmOptions = (
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
        <Text style={styles.title}>{title}</Text>

        <FlatList
          data={products}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProductSuggestionCard
              item={item}
              quantity={getQuantity(item)}
              onPressCard={() => onPressCard(item)}
              onPressOptions={() => handleOpenOptions(item)}
              onIncrease={() => onIncrease(item)}
              onDecrease={() => onDecrease(item)}
            />
          )}
        />
      </View>

      <ProductOptionsBottomSheet
        visible={sheetVisible}
        product={selectedProduct}
        initialQuantities={initialQuantities}
        onClose={handleCloseOptions}
        onConfirm={handleConfirmOptions}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  title: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    fontSize: Typography.heading,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  listContent: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.sm,
  },
});