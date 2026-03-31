import {
  Product,
  ProductDetailsResponse,
  ProductListItem,
} from '../types/product.types';

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    brand: 'Cadbury',
    name: 'Dairy Milk Silk Chocolate Bar',
    description:
      'Smooth and creamy milk chocolate with rich silk texture. Perfect for gifting and everyday indulgence.',
    image:
      'https://pngfile.net/files/preview/960x1080/21567003175as1voif4usildgu0n7t7zyhubxlyaosgxrwm0shofim4nfc4ehvx7w5m9wnbfuid780udvyfauegh5ewoya3e0zasr9bcp4edcyf.png',
    discountLabel: '52% OFF',
    variants: [
      {
        id: 'prod-1-var-1',
        label: 'Regular Pack',
        weightLabel: '64 g',
        price: 444,
        originalPrice: 444,
        inStock: true,
        isDefault: true,
      },
      {
        id: 'prod-1-var-2',
        label: 'Family Pack',
        weightLabel: '128 g',
        price: 799,
        originalPrice: 899,
        inStock: true,
      },
    ],
    similarProductIds: ['prod-2', 'prod-3', 'prod-4'],
    alsoBoughtProductIds: ['prod-2', 'prod-5', 'prod-6'],
  },
  {
    id: 'prod-2',
    brand: 'Tata Tea',
    name: 'Gold Premium Assam Tea Rich Taste',
    description:
      'Premium Assam tea with rich aroma and strong taste for daily refreshment.',
    image:
      'https://www.tataconsumer.com/sites/g/files/gfwrlq316/files/tata-tea-india.png',
    discountLabel: '52% OFF',
    variants: [
      {
        id: 'prod-2-var-1',
        label: 'Standard Pack',
        weightLabel: '1 kg',
        price: 444,
        originalPrice: 444,
        inStock: true,
        isDefault: true,
      },
      {
        id: 'prod-2-var-2',
        label: 'Value Pack',
        weightLabel: '3 x 1 kg',
        price: 199,
        originalPrice: 399,
        inStock: true,
      },
    ],
    similarProductIds: ['prod-3', 'prod-4', 'prod-5'],
    alsoBoughtProductIds: ['prod-1', 'prod-3', 'prod-6'],
  },
  {
    id: 'prod-3',
    brand: 'Tata Tea',
    name: 'Gold Premium Assam Tea Rich Blend',
    description:
      'Balanced flavour and premium leaves crafted for an irresistible cup of tea.',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/ciw/2026/2/18/3a1a003c-d1ed-4414-9f82-bf38ec0ddf9b_NHYZ0J0VUM_MN_18022026.png',
    discountLabel: '52% OFF',
    variants: [
      {
        id: 'prod-3-var-1',
        label: 'Single Pack',
        weightLabel: '1 kg',
        price: 444,
        originalPrice: 444,
        inStock: true,
        isDefault: true,
      },
      {
        id: 'prod-3-var-2',
        label: 'Bulk Pack',
        weightLabel: '3 x 1 kg',
        price: 199,
        originalPrice: 399,
        inStock: true,
      },
    ],
    similarProductIds: ['prod-2', 'prod-4', 'prod-6'],
    alsoBoughtProductIds: ['prod-1', 'prod-2', 'prod-4'],
  },
  {
    id: 'prod-4',
    brand: 'Tata Tea',
    name: 'Organic Apple',
    description:
      'Fresh and premium organic apples sourced for everyday healthy snacking.',
    image:
      'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/ciw/2025/12/18/06d8a2c5-084d-4a7a-9c16-67fe873482ab_X55PQJNMFG_MN_18122025.png',
    discountLabel: '52% OFF',
    variants: [
      {
        id: 'prod-4-var-1',
        label: 'Single Option',
        weightLabel: '1 kg',
        price: 444,
        originalPrice: 444,
        inStock: true,
        isDefault: true,
      },
    ],
    similarProductIds: ['prod-2', 'prod-3', 'prod-5'],
    alsoBoughtProductIds: ['prod-1', 'prod-3', 'prod-6'],
  },
  {
    id: 'prod-5',
    brand: 'Dannon',
    name: 'Skyr Nature',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquam eros sed justo dignissim, sed semper odio tristique. Nam et tortor ut arcu maximus bibendum. Proin mi justo, pharetra id metus vel, fermentum lacinia enim. Pellentesque dapibus congue ornare. Morbi et libero vitae nibh dignissim dictum sit amet ut dui. Phasellus quis scelerisque nisl. Sed malesuada orci a turpis iaculis mattis. Praesent lacus elit, feugiat eu erat eu, porttitor dictum odio.',
    image:
      'https://dojwn62xby8qn.cloudfront.net/public/media/offer_products/30451-1756131318082.png',
    discountLabel: '52% OFF',
    variants: [
      {
        id: 'prod-5-var-1',
        label: 'Single Option',
        weightLabel: '1 kg',
        price: 444,
        originalPrice: 444,
        inStock: true,
        isDefault: true,
      },
    ],
    similarProductIds: ['prod-2', 'prod-3', 'prod-4'],
    alsoBoughtProductIds: ['prod-1', 'prod-2', 'prod-6'],
  },
  {
    id: 'prod-6',
    brand: 'Fanta',
    name: 'Fanta Cold Drink',
    description:
      'Everyday classic tea with a familiar taste and refreshing flavour.',
    image:
      'https://www.bbassets.com/media/uploads/p/l/100401175_9-fanta-soft-drink-orange-flavoured.jpg',
    discountLabel: '52% OFF',
    variants: [
      {
        id: 'prod-6-var-1',
        label: 'Single Option',
        weightLabel: '1 kg',
        price: 444,
        originalPrice: 444,
        inStock: false,
        isDefault: true,
      },
    ],
    similarProductIds: ['prod-2', 'prod-3', 'prod-4'],
    alsoBoughtProductIds: ['prod-1', 'prod-2', 'prod-5'],
  },
];

export const mapProductToListItem = (product: Product): ProductListItem => {
  const defaultVariant =
    product.variants.find(variant => variant.isDefault) ?? product.variants[0];

  return {
    id: product.id,
    brand: product.brand,
    name: product.name,
    image: product.image,
    weightLabel: defaultVariant.weightLabel,
    price: defaultVariant.price,
    originalPrice: defaultVariant.originalPrice,
    discountLabel: product.discountLabel,
    hasOptions: product.variants.length > 1,
    optionCount: product.variants.length,
    inStock: product.variants.some(variant => variant.inStock),
    defaultVariantId: defaultVariant.id,
    defaultVariantLabel: defaultVariant.label,
  };
};

export const mockProductList: ProductListItem[] = mockProducts.map(
  mapProductToListItem,
);

export const getMockProductDetails = (
  productId: string,
): ProductDetailsResponse | null => {
  const product = mockProducts.find(item => item.id === productId);

  if (!product) {
    return null;
  }

  const similarProducts = product.similarProductIds
    .map(id => mockProducts.find(item => item.id === id))
    .filter((item): item is Product => Boolean(item))
    .map(mapProductToListItem);

  const alsoBoughtProducts = product.alsoBoughtProductIds
    .map(id => mockProducts.find(item => item.id === id))
    .filter((item): item is Product => Boolean(item))
    .map(mapProductToListItem);

  return {
    product,
    similarProducts,
    alsoBoughtProducts,
  };
};