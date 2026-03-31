import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
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
import { mockProducts } from '../data/products.mock';
import { ProductOptionsBottomSheet } from '../../../components/cart/ProductOptionsBottomSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({ navigation }: Props) => {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOptionSheetVisible, setIsOptionSheetVisible] = useState(false);
  const [selectedOptionQuantities, setSelectedOptionQuantities] = useState<
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

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await productService.getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch {
        if (isMounted) {
          setError('Failed to load products');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const cartItemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
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

  const getProductById = (productId: string) => {
    return mockProducts.find(product => product.id === productId) ?? null;
  };

  const handleOpenProduct = (productId: string) => {
    navigation.navigate('Product', { productId });
  };

  const handleDirectAdd = (product: Product) => {
    const defaultVariant =
      product.variants.find(variant => variant.isDefault) ?? product.variants[0];

    if (!defaultVariant || !defaultVariant.inStock) {
      return;
    }

    const cartId = getVariantCartId(product, defaultVariant);
    const existingItem = items.find(item => item.id === cartId);

    if (existingItem) {
      increaseQuantity(cartId);
      return;
    }

    const cartItem = mapVariantToCartItem(product, defaultVariant, 1);
    addItemToCart(cartItem);
  };

  const openOptionSheet = (product: Product) => {
    const initialQuantities: Record<string, number> = {};

    product.variants.forEach(variant => {
      initialQuantities[variant.id] = getVariantQuantity(product, variant);
    });

    setSelectedProduct(product);
    setSelectedOptionQuantities(initialQuantities);
    setIsOptionSheetVisible(true);
  };

  const closeOptionSheet = () => {
    setIsOptionSheetVisible(false);
    setSelectedProduct(null);
    setSelectedOptionQuantities({});
  };

  const handleConfirmOptions = (
    nextSelectedQuantities: Record<string, number>,
  ) => {
    if (!selectedProduct) {
      return;
    }

    selectedProduct.variants.forEach(variant => {
      const desiredQuantity = nextSelectedQuantities[variant.id] ?? 0;
      const cartId = getVariantCartId(selectedProduct, variant);
      const existingQuantity =
        items.find(item => item.id === cartId)?.quantity ?? 0;

      if (desiredQuantity > existingQuantity) {
        const diff = desiredQuantity - existingQuantity;

        if (existingQuantity === 0) {
          const cartItem = mapVariantToCartItem(
            selectedProduct,
            variant,
            diff,
          );
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

    closeOptionSheet();
  };

  const handleCardAction = (productItem: ProductListItem) => {
    const fullProduct = getProductById(productItem.id);

    if (!fullProduct) {
      return;
    }

    if (productItem.hasOptions) {
      openOptionSheet(fullProduct);
      return;
    }

    handleDirectAdd(fullProduct);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Shop</Text>
      <Text style={styles.headerSubtitle}>
        Explore products and add them to cart
      </Text>
    </View>
  );

  const renderProductCard = ({ item }: { item: ProductListItem }) => {
    return (
      <Pressable style={styles.card} onPress={() => handleOpenProduct(item.id)}>
        <View style={styles.imageWrapper}>
          {item.discountLabel ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{item.discountLabel}</Text>
            </View>
          ) : null}

          <Image source={{ uri: item.image }} style={styles.productImage} />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.brandText}>{item.brand}</Text>

          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <Text style={styles.weightText}>{item.weightLabel}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>₹{item.price}</Text>
            {item.originalPrice ? (
              <Text style={styles.originalPriceText}>₹{item.originalPrice}</Text>
            ) : null}
          </View>

          <Pressable
            style={[
              styles.actionButton,
              !item.inStock && styles.actionButtonDisabled,
            ]}
            disabled={!item.inStock}
            onPress={() => handleCardAction(item)}
          >
            <Text
              style={[
                styles.actionButtonText,
                !item.inStock && styles.actionButtonTextDisabled,
              ]}
            >
              {!item.inStock
                ? 'Out of stock'
                : item.hasOptions
                ? `${item.optionCount} options`
                : 'Add'}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.screenBackground}
        />
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.helperText}>Loading products...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.screenBackground}
      />

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={renderProductCard}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
      />

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
        visible={isOptionSheetVisible}
        product={selectedProduct}
        initialQuantities={selectedOptionQuantities}
        onClose={closeOptionSheet}
        onConfirm={handleConfirmOptions}
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
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: 120,
  },
  headerContainer: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.largeTitle,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'relative',
    height: 150,
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.couponBlue,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    zIndex: 1,
  },
  discountBadgeText: {
    color: Colors.white,
    fontSize: Typography.tiny,
    fontWeight: FontWeight.bold,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  cardBody: {
    padding: Spacing.md,
  },
  brandText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  productName: {
    fontSize: Typography.body,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    minHeight: 40,
    marginBottom: Spacing.xs,
  },
  weightText: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  priceText: {
    fontSize: Typography.bodyLarge,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  originalPriceText: {
    fontSize: Typography.caption,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  actionButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: Typography.body,
    fontWeight: FontWeight.bold,
  },
  actionButtonTextDisabled: {
    color: Colors.textSecondary,
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
});