import { Category } from "./category";



export interface Cart {
  items:Array<CartItem>;
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  id: string;
  category: Category;
  description: string;
  image: string;
  vendorId: string;
  attributes?: any[]; // This property is optional and may not always exist
  stockAttribute?: any; // Ajoutez cette ligne

}

export interface CartData {
  productId: any; // Vous pouvez utiliser le type approprié pour productId
  quantity: number;
}


