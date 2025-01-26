import { environment } from '../environment/environment.development';

import { ShopProduct } from '../types/shop';

export class ShopService {
  private static readonly baseUrl = `${environment.serverUrl}/api/shop`;

  public static async getProducts(): Promise<ShopProduct[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  public static async purchaseProduct(productId: number): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${this.baseUrl}/products/${productId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error purchasing product:', error);
      throw error;
    }
  }
}
