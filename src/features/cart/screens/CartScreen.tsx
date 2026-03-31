import React, { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useCartStore } from '../store/cartStore';
import { Colors } from '../../../theme/colors';
import { Spacing } from '../../../theme/spacing';
import { Radius } from '../../../theme/radius';
import { Typography, FontWeight } from '../../../theme/typography';
import { RootStackParamList } from '../../../app/navigation/AppNavigator';
import { mockProducts } from '../data/products.mock';
import { CartItem } from '../types/cart.types';
import {
  Product,
  ProductListItem,
  ProductVariant,
} from '../types/product.types';
import { DeliveryAddressSection } from '../../../components/cart/DeliveryAddressSection';
import { CartItemCard } from '../../../components/cart/CartItemCard';
import { ProductSuggestionSection } from '../../../components/Product/ProductSuggestionSection';
import { CartCheckoutDetailsSection } from '../../../components/cart/CartCheckoutDetailsSection';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Cart'>;

export const CartScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const {
    fetchCart,
    isLoading,
    error,
    items,
    coupons,
    address,
    isLoggedIn,
    deliveryMode,
    meta,
    getSummary,
    increaseQuantity,
    decreaseQuantity,
    applyCoupon,
    addItemToCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const summary = getSummary();

  const mapVariantToCartItem = (
    baseProduct: Product,
    variant: ProductVariant,
    quantity: number,
  ): CartItem => {
    return {
      id: `${baseProduct.id}-${variant.id}`,
      productId: baseProduct.id,
      brand: baseProduct.brand,
      name: baseProduct.name,
      image: baseProduct.image,
      discountLabel: baseProduct.discountLabel,
      optionLabel: `${variant.label} • ${variant.weightLabel}`,
      price: variant.price,
      originalPrice: variant.originalPrice,
      quantity,
      inStock: variant.inStock,
      maxQuantity: 10,
    };
  };

  const getVariantCartId = (baseProduct: Product, variant: ProductVariant) =>
    `${baseProduct.id}-${variant.id}`;

  const getVariantQuantity = (baseProduct: Product, variant: ProductVariant) => {
    const cartId = getVariantCartId(baseProduct, variant);
    return items.find(item => item.id === cartId)?.quantity ?? 0;
  };

  const resolveProductById = (productId: string) =>
    mockProducts.find(item => item.id === productId) ?? null;

  const getInitialOptionQuantities = (product: Product) => {
    const initialQuantities: Record<string, number> = {};

    product.variants.forEach(variant => {
      initialQuantities[variant.id] = getVariantQuantity(product, variant);
    });

    return initialQuantities;
  };

  const handleConfirmProductOptions = (
    product: Product,
    selectedQuantities: Record<string, number>,
  ) => {
    product.variants.forEach(variant => {
      const desiredQuantity = selectedQuantities[variant.id] ?? 0;
      const cartId = getVariantCartId(product, variant);
      const existingQuantity =
        items.find(item => item.id === cartId)?.quantity ?? 0;

      if (desiredQuantity > existingQuantity) {
        const diff = desiredQuantity - existingQuantity;

        if (existingQuantity === 0) {
          const cartItem = mapVariantToCartItem(product, variant, diff);
          addItemToCart(cartItem);
        } else {
          for (let i = 0; i < diff; i += 1) {
            increaseQuantity(cartId);
          }
        }
      }

      if (desiredQuantity < existingQuantity) {
        const diff = existingQuantity - desiredQuantity;

        for (let i = 0; i < diff; i += 1) {
          decreaseQuantity(cartId);
        }
      }
    });
  };

  const suggestionProducts: ProductListItem[] = useMemo(() => {
    const cartProductIds = new Set(items.map(item => item.productId));

    return mockProducts
      .filter(product => !cartProductIds.has(product.id))
      .slice(0, 3)
      .map(product => {
        const defaultVariant =
          product.variants.find(variant => variant.isDefault) ??
          product.variants[0];

        return {
          id: product.id,
          brand: product.brand,
          name: product.name,
          image: product.image,
          weightLabel: defaultVariant.weightLabel,
          price: defaultVariant.price,
          ...(defaultVariant.originalPrice !== undefined
            ? { originalPrice: defaultVariant.originalPrice }
            : {}),
          ...(product.discountLabel !== undefined
            ? { discountLabel: product.discountLabel }
            : {}),
          hasOptions: product.variants.length > 1,
          optionCount: product.variants.length,
          inStock: product.variants.some(variant => variant.inStock),
          defaultVariantId: defaultVariant.id,
          defaultVariantLabel: defaultVariant.label,
        };
      });
  }, [items]);

  const getSuggestedProductCartId = (item: ProductListItem) =>
    `${item.id}-${item.defaultVariantId}`;

  const getSuggestedProductQuantity = (item: ProductListItem) => {
    const cartId = getSuggestedProductCartId(item);
    return items.find(cartItem => cartItem.id === cartId)?.quantity ?? 0;
  };

  const handleIncreaseSuggestedProduct = (item: ProductListItem) => {
    const fullProduct = resolveProductById(item.id);

    if (!fullProduct) {
      const cartId = `${item.id}-${item.defaultVariantId}`;
      const existingItem = items.find(cartItem => cartItem.id === cartId);

      if (existingItem) {
        increaseQuantity(cartId);
        return;
      }

      addItemToCart({
        id: cartId,
        productId: item.id,
        brand: item.brand,
        name: item.name,
        image: item.image,
        discountLabel: item.discountLabel,
        optionLabel: `${item.defaultVariantLabel} • ${item.weightLabel}`,
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: 1,
        inStock: item.inStock,
        maxQuantity: 10,
      });
      return;
    }

    const defaultVariant =
      fullProduct.variants.find(variant => variant.isDefault) ??
      fullProduct.variants[0];

    if (!defaultVariant || !defaultVariant.inStock) {
      return;
    }

    const cartId = getVariantCartId(fullProduct, defaultVariant);
    const existingItem = items.find(cartItem => cartItem.id === cartId);

    if (existingItem) {
      increaseQuantity(cartId);
      return;
    }

    const cartItem = mapVariantToCartItem(fullProduct, defaultVariant, 1);
    addItemToCart(cartItem);
  };

  const handleDecreaseSuggestedProduct = (item: ProductListItem) => {
    decreaseQuantity(getSuggestedProductCartId(item));
  };

  const handleAddAddress = () => {
    navigation.navigate('Address');
  };

  const handleChangeAddress = () => {
    navigation.navigate('Address');
  };

  const handleProceed = () => {
    if (!address) {
      navigation.navigate('Address');
      return;
    }

    if (!address.serviceable) {
      return;
    }

    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }
  };

  if (isLoading && !meta) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.screenBackground}
        />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </SafeAreaView>
    );
  }

  if (error && !meta) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.screenBackground}
        />
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  const hasItems = items.length > 0;
  const hasAddress = !!address;
  const isServiceable = !!address?.serviceable;
  const canPressBottomCta = hasItems && hasAddress && isServiceable;
  const stickyBottomSpace = hasAddress ? 175 : 150;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.screenBackground}
      />

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: stickyBottomSpace },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {meta?.savingMessage ? (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>{meta.savingMessage}</Text>
          </View>
        ) : null}

        {meta?.warningMessage && hasItems ? (
          <View style={styles.warningBanner}>
            <Text style={styles.warningBannerText}>{meta.warningMessage}</Text>
          </View>
        ) : null}

        <View style={styles.cartItemsSection}>
          {!hasItems ? (
            <View style={styles.emptyStateWrap}>
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptyText}>
                Add products from the home or product page to see them here.
              </Text>
            </View>
          ) : (
            items.map(item => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
              />
            ))
          )}
        </View>

        <ProductSuggestionSection
          title="Did you forget?"
          products={suggestionProducts}
          getQuantity={getSuggestedProductQuantity}
          onPressCard={item =>
            navigation.navigate('Product', { productId: item.id })
          }
          onIncrease={handleIncreaseSuggestedProduct}
          onDecrease={handleDecreaseSuggestedProduct}
          resolveProductById={resolveProductById}
          getInitialOptionQuantities={getInitialOptionQuantities}
          onConfirmOptions={handleConfirmProductOptions}
        />

        {hasAddress && isLoggedIn ? (
          <CartCheckoutDetailsSection
            coupons={coupons}
            onApplyCoupon={applyCoupon}
            cashbackAmount={meta?.cashbackAmount}
            summary={summary}
          />
        ) : null}
      </ScrollView>

      <View style={styles.bottomSheetArea}>
        <DeliveryAddressSection
          address={address}
          totalPayable={summary?.totalPayable ?? 0}
          canProceed={canPressBottomCta}
          isLoggedIn={isLoggedIn}
          deliveryMode={deliveryMode}
          onAddAddress={handleAddAddress}
          onChangeAddress={handleChangeAddress}
          onProceed={handleProceed}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: Colors.screenBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: Typography.body,
    color: Colors.danger,
    fontWeight: FontWeight.medium,
  },
  contentContainer: {
    padding: Spacing.lg,
  },

  infoBanner: {
    backgroundColor: Colors.infoBg,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoBannerText: {
    color: Colors.infoText,
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
  },

  warningBanner: {
    backgroundColor: Colors.warningBg,
    borderWidth: 1,
    borderColor: Colors.warningBorder,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  warningBannerText: {
    color: Colors.warningText,
    fontSize: Typography.caption,
    fontWeight: FontWeight.medium,
  },

  cartItemsSection: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },

  emptyStateWrap: {
    paddingVertical: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  bottomSheetArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});