import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/radius';
import { Spacing } from '../../theme/spacing';
import { FontWeight } from '../../theme/typography';
import { QuantityStepper } from './QuantityStepper';
import { CartItem } from '../../features/cart/types/cart.types';

type Props = {
  item: CartItem;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
};

export const CartItemCard = ({ item, onIncrease, onDecrease }: Props) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* IMAGE */}
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* CONTENT */}
        <View style={styles.content}>
          {/* LEFT TEXT */}
          <View style={styles.left}>
            <Text numberOfLines={2} style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.weight}>{item.optionLabel}</Text>
          </View>

          {/* RIGHT SIDE */}
          <View style={styles.right}>
            <QuantityStepper
              quantity={item.quantity}
              onIncrease={() => onIncrease(item.id)}
              onDecrease={() => onDecrease(item.id)}
              disabled={!item.inStock}
            />

            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{item.price}</Text>

              {item.originalPrice && (
                <Text style={styles.originalPrice}>
                  ₹{item.originalPrice}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },

  row: {
    flexDirection: 'row',
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: Radius.lg,
    backgroundColor: '#F5F5F5',
    marginRight: Spacing.md,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  left: {
    flex: 1,
    paddingRight: Spacing.sm,
    justifyContent: 'center',
  },

  name: {
    fontSize: 15,
    fontWeight: FontWeight.semibold,
    color: '#000000',
  },

  weight: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: '#C0C0C0',
  },

  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  price: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    color: '#000000',
  },

  originalPrice: {
    marginLeft: Spacing.sm,
    fontSize: 12,
    color: '#C0C0C0',
    textDecorationLine: 'line-through',
  },
});