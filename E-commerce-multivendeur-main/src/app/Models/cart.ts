// src/app/Models/cart.ts
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;        // Optionnel
  description?: string;     // Optionnel
  vendorId?: number;        // Optionnel
}

export interface Cart {
  items: CartItem[];
}