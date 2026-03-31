export type ProductVariant = {
  id: string;
  label: string;
  weightLabel: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  isDefault?: boolean;
};

export type Product = {
  id: string;
  brand: string;
  name: string;
  description: string;
  image: string;
  discountLabel?: string;
  variants: ProductVariant[];
  similarProductIds: string[];
  alsoBoughtProductIds: string[];
};

export type ProductListItem = {
  id: string;
  brand: string;
  name: string;
  image: string;
  weightLabel: string;
  price: number;
  originalPrice?: number;
  discountLabel?: string;
  hasOptions: boolean;
  optionCount: number;
  inStock: boolean;
    defaultVariantId: string;
  defaultVariantLabel: string;
};

export type ProductDetailsResponse = {
  product: Product;
  similarProducts: ProductListItem[];
  alsoBoughtProducts: ProductListItem[];
};

export type SelectedVariantMap = Record<string, number>;