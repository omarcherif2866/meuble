import { Category } from "../Models/category";

export interface Product {
  id?: any;                 // facultatif pour la création
  name: string;
  price: number;
  images: string[];             // liste d'URLs des images
  category: Category;           // ou juste categoryId: number;
  description: string;
  nouveautes: boolean;
  remise: boolean;
}
