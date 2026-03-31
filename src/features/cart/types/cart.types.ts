export type ProductOption = {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
  weightLabel: string;
  inStock: boolean;
};

export type CartItem = {
  id: string;
  productId: string;
  brand: string;
  name: string;
  image: string;
  discountLabel?: string;
  optionLabel: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  inStock: boolean;
  maxQuantity?: number;
};

export type SuggestedProduct = {
  id: string;
  brand: string;
  name: string;
  image: string;
  weightLabel: string;
  price: number;
  originalPrice?: number;
  discountLabel?: string;
  hasOptions?: boolean;
};

export type Coupon = {
  id: string;
  title: string;
  code: string;
  discountAmount: number;
  description: string;
  applied: boolean;
};

export type DeliveryInstructionKey =
  | 'dont_ring'
  | 'dont_call'
  | 'leave_with_guard';

export type AddressInfo = {
  id: string;
  title: string;
  addressLine: string;
  serviceable: boolean;
};

export type CartMeta = {
  deliveryFee: number;
  freeDeliveryThreshold: number;
  platformFee: number;
  cashbackAmount: number;
  warningMessage?: string;
  savingMessage: string;
};

export type CartResponse = {
  items: CartItem[];
  suggestedProducts: SuggestedProduct[];
  coupons: Coupon[];
  address: AddressInfo | null;
  isLoggedIn: boolean;
  meta: CartMeta;
};