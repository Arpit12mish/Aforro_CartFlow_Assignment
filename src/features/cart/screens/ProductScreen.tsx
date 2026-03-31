import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../app/navigation/AppNavigator';
import { productService } from '../services/product.service';
import {
  Product,
  ProductListItem,
  ProductVariant,
} from '../types/product.types';
import { Colors } from '../../../theme/colors';
import { Spacing } from '../../../theme/spacing';
import { Radius } from '../../../theme/radius';
import { Typography, FontWeight } from '../../../theme/typography';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../types/cart.types';
import { QuantityStepper } from '../../../components/cart/QuantityStepper';
import { ProductSuggestionSection } from '../../../components/Product/ProductSuggestionSection';
import { ProductOptionsBottomSheet } from '../../../components/cart/ProductOptionsBottomSheet';
import { mockProducts } from '../data/products.mock';

type Props = NativeStackScreenProps<RootStackParamList, 'Product'>;

const DiscountRibbon = ({ label }: { label: string }) => {
  return (
    <View style={styles.ribbonWrapper}>
      <View style={styles.ribbonBody}>
        <Text style={styles.ribbonText}>{label}</Text>
      </View>

      <View style={styles.ribbonTeethRow}>
        <View style={styles.ribbonTooth} />
        <View style={styles.ribbonTooth} />
        <View style={styles.ribbonTooth} />
      </View>
    </View>
  );
};

export const ProductScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductListItem[]>([]);
  const [alsoBoughtProducts, setAlsoBoughtProducts] = useState<ProductListItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMainOptionSheetVisible, setIsMainOptionSheetVisible] =
    useState(false);
  const [mainSheetInitialQuantities, setMainSheetInitialQuantities] = useState<
    Record<string, number>
  >({});

  const items = useCartStore(state => state.items);
  const fetchCart = useCartStore(state => state.fetchCart);
  const addItemToCart = useCartStore(state => state.addItemToCart);
  const increaseQuantity = useCartStore(state => state.increaseQuantity);
  const decreaseQuantity = useCartStore(state => state.decreaseQuantity);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await productService.getProductDetails(productId);

        if (isMounted) {
          setProduct(data.product);
          setSimilarProducts(data.similarProducts);
          setAlsoBoughtProducts(data.alsoBoughtProducts);
        }
      } catch {
        if (isMounted) {
          setError('Failed to load product details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const defaultVariant = useMemo(
    () =>
      product?.variants.find(variant => variant.isDefault) ??
      product?.variants[0],
    [product],
  );

  const hasMultipleOptions = useMemo(
    () => (product?.variants?.length ?? 0) > 1,
    [product],
  );

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

  const getInitialOptionQuantities = (baseProduct: Product) => {
    const initialQuantities: Record<string, number> = {};

    baseProduct.variants.forEach(variant => {
      initialQuantities[variant.id] = getVariantQuantity(baseProduct, variant);
    });

    return initialQuantities;
  };

  const handleConfirmProductOptions = (
    baseProduct: Product,
    selectedQuantities: Record<string, number>,
  ) => {
    baseProduct.variants.forEach(variant => {
      const desiredQuantity = selectedQuantities[variant.id] ?? 0;
      const cartId = getVariantCartId(baseProduct, variant);
      const existingQuantity =
        items.find(item => item.id === cartId)?.quantity ?? 0;

      if (desiredQuantity > existingQuantity) {
        const diff = desiredQuantity - existingQuantity;

        if (existingQuantity === 0) {
          const cartItem = mapVariantToCartItem(baseProduct, variant, diff);
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

  const handleAddSingleOption = () => {
    if (!product || !defaultVariant || !defaultVariant.inStock) {
      return;
    }

    const cartItem = mapVariantToCartItem(product, defaultVariant, 1);
    addItemToCart(cartItem);
  };

  const handleIncreaseSingleVariant = () => {
    if (!product || !defaultVariant || !defaultVariant.inStock) {
      return;
    }

    const cartId = getVariantCartId(product, defaultVariant);
    const existingItem = items.find(item => item.id === cartId);

    if (existingItem) {
      increaseQuantity(cartId);
      return;
    }

    handleAddSingleOption();
  };

  const handleDecreaseSingleVariant = () => {
    if (!product || !defaultVariant) {
      return;
    }

    const cartId = getVariantCartId(product, defaultVariant);
    decreaseQuantity(cartId);
  };

  const openMainOptionSheet = () => {
    if (!product) {
      return;
    }

    setMainSheetInitialQuantities(getInitialOptionQuantities(product));
    setIsMainOptionSheetVisible(true);
  };

  const closeMainOptionSheet = () => {
    setIsMainOptionSheetVisible(false);
    setMainSheetInitialQuantities({});
  };

  const handleConfirmMainOptions = (
    selectedQuantities: Record<string, number>,
  ) => {
    if (!product) {
      return;
    }

    handleConfirmProductOptions(product, selectedQuantities);
    closeMainOptionSheet();
  };

  const handleOpenProduct = (nextProductId: string) => {
    navigation.push('Product', { productId: nextProductId });
  };

  const resolveProductById = (id: string) =>
    mockProducts.find(item => item.id === id) ?? null;

  const getProductCardCartId = (item: ProductListItem) =>
    `${item.id}-${item.defaultVariantId}`;

  const getProductCardQuantity = (item: ProductListItem) =>
    items.find(cartItem => cartItem.id === getProductCardCartId(item))
      ?.quantity ?? 0;

  const handleIncreaseSuggestion = (item: ProductListItem) => {
    if (!item.inStock) {
      return;
    }

    if (item.hasOptions) {
      return;
    }

    const cartId = getProductCardCartId(item);
    const existing = items.find(cartItem => cartItem.id === cartId);

    if (existing) {
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
  };

  const handleDecreaseSuggestion = (item: ProductListItem) => {
    if (item.hasOptions) {
      return;
    }

    decreaseQuantity(getProductCardCartId(item));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.screenBackground}
        />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.helperText}>Loading product...</Text>
      </SafeAreaView>
    );
  }

  if (error || !product || !defaultVariant) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.screenBackground}
        />
        <Text style={styles.errorText}>{error ?? 'Product not found'}</Text>
      </SafeAreaView>
    );
  }

  const singleVariantQuantity = getVariantQuantity(product, defaultVariant);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.screenBackground}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.iconButtonText}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle} numberOfLines={1}>
            Product Details
          </Text>

          <Pressable style={styles.iconButton}>
            <Text style={styles.iconButtonText}>↗</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroImageWrap}>
            {product.discountLabel ? (
              <DiscountRibbon label={product.discountLabel} />
            ) : null}

            <Image source={{ uri: product.image }} style={styles.heroImage} />
          </View>

          <View style={styles.dotRow}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

          <Text style={styles.brandText} numberOfLines={1}>
            {product.brand}
          </Text>

          <Text numberOfLines={2} style={styles.productName}>
            {product.name}
          </Text>

          <View style={styles.heroBottomRow}>
            <View style={styles.heroMetaLeft}>
              <Text style={styles.weightText}>{defaultVariant.weightLabel}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.priceText}>₹{defaultVariant.price}</Text>
                {defaultVariant.originalPrice ? (
                  <Text style={styles.originalPriceText}>
                    ₹{defaultVariant.originalPrice}
                  </Text>
                ) : null}
              </View>
            </View>

            {hasMultipleOptions ? (
              <Pressable
                style={[
                  styles.optionsButton,
                  !defaultVariant.inStock && styles.optionsButtonDisabled,
                ]}
                disabled={!defaultVariant.inStock}
                onPress={openMainOptionSheet}
              >
                <Text
                  style={[
                    styles.optionsButtonText,
                    !defaultVariant.inStock && styles.optionsButtonTextDisabled,
                  ]}
                >
                  {defaultVariant.inStock
                    ? `${product.variants.length} options`
                    : 'Out of stock'}
                </Text>
              </Pressable>
            ) : (
              <QuantityStepper
                quantity={singleVariantQuantity}
                onIncrease={handleIncreaseSingleVariant}
                onDecrease={handleDecreaseSingleVariant}
                disabled={!defaultVariant.inStock}
              />
            )}
          </View>
        </View>

        <ProductSuggestionSection
          title="Similiar product"
          products={similarProducts}
          getQuantity={getProductCardQuantity}
          onPressCard={item => handleOpenProduct(item.id)}
          onIncrease={handleIncreaseSuggestion}
          onDecrease={handleDecreaseSuggestion}
          resolveProductById={resolveProductById}
          getInitialOptionQuantities={getInitialOptionQuantities}
          onConfirmOptions={handleConfirmProductOptions}
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>
        </View>

        <ProductSuggestionSection
          title="Customers also bought"
          products={alsoBoughtProducts}
          getQuantity={getProductCardQuantity}
          onPressCard={item => handleOpenProduct(item.id)}
          onIncrease={handleIncreaseSuggestion}
          onDecrease={handleDecreaseSuggestion}
          resolveProductById={resolveProductById}
          getInitialOptionQuantities={getInitialOptionQuantities}
          onConfirmOptions={handleConfirmProductOptions}
        />
      </ScrollView>

      {cartItemCount > 0 ? (
        <Pressable
          style={styles.viewCartBar}
          onPress={() => navigation.navigate('Cart')}
        >
          <View>
            <Text style={styles.viewCartCaption}>Items in cart</Text>
            <Text style={styles.viewCartCount}>
              {cartItemCount} item{cartItemCount > 1 ? 's' : ''}
            </Text>
          </View>

          <Text style={styles.viewCartText}>View Cart</Text>
        </Pressable>
      ) : null}

      <ProductOptionsBottomSheet
        visible={isMainOptionSheetVisible}
        product={product}
        initialQuantities={mainSheetInitialQuantities}
        onClose={closeMainOptionSheet}
        onConfirm={handleConfirmMainOptions}
      />
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

  helperText: {
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: 140,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconButtonText: {
    color: Colors.textPrimary,
    fontSize: Typography.heading,
    fontWeight: FontWeight.bold,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md,
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  heroCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    marginBottom: Spacing.xl,
  },

  heroImageWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 360,
    borderRadius: Radius.lg,
    backgroundColor: Colors.white,
  },

  heroImage: {
    width: 220,
    height: 280,
    resizeMode: 'contain',
  },

  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: '#F59B4C',
  },

  brandText: {
    fontSize: Typography.bodyLarge,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },

  productName: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  heroBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },

  heroMetaLeft: {
    flex: 1,
    paddingRight: Spacing.md,
  },

  weightText: {
    fontSize: Typography.largeTitle,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  priceText: {
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },

  originalPriceText: {
    fontSize: 15,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
  },

  optionsButton: {
    minWidth: 144,
    height: 50,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },

  optionsButtonDisabled: {
    backgroundColor: Colors.disabled,
  },

  optionsButtonText: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  optionsButtonTextDisabled: {
    color: Colors.textSecondary,
  },

  sectionContainer: {
    marginBottom: Spacing.xl,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    color: Colors.black,
    marginBottom: Spacing.md,
  },

  descriptionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
  },

  descriptionText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  viewCartBar: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  viewCartCaption: {
    fontSize: Typography.caption,
    color: Colors.white,
    opacity: 0.9,
  },

  viewCartCount: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  viewCartText: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  ribbonWrapper: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    zIndex: 5,
  },

  ribbonBody: {
    backgroundColor: Colors.couponBlue,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 7,
    minWidth: 48,
    alignItems: 'center',
  },

  ribbonText: {
    color: Colors.white,
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'center',
    fontWeight: FontWeight.bold,
  },

  ribbonTeethRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ribbonTooth: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.couponBlue,
  },
});