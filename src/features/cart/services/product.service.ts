import {
  getMockProductDetails,
  mockProductList,
} from '../data/products.mock';
import {
  ProductDetailsResponse,
  ProductListItem,
} from '../types/product.types';

const wait = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export const productService = {
  async getProducts(): Promise<ProductListItem[]> {
    await wait(300);
    return mockProductList;
  },

  async getProductDetails(
    productId: string,
  ): Promise<ProductDetailsResponse> {
    await wait(300);

    const data = getMockProductDetails(productId);

    if (!data) {
      throw new Error('Product not found');
    }

    return data;
  },
};