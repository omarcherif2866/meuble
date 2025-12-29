import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../Models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

private apiUrl = 'http://localhost:9090/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(productData: any, imageFiles: File[]): Observable<Product> {
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    formData.append('categoryId', productData.category.id.toString()); // Attention: categoryId, pas category
    formData.append('description', productData.description || '');
    formData.append('nouveautes', productData.nouveautes.toString());
    formData.append('remise', productData.remise.toString());
    
    // Ajouter les images
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file, file.name);
      });
    }
    
    return this.http.post<Product>(this.apiUrl, formData);
  }

  update(id: number, productData: any, imageFiles?: File[]): Observable<Product> {
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('price', productData.price.toString());
    formData.append('categoryId', productData.category.id.toString());
    formData.append('description', productData.description || '');
    formData.append('nouveautes', productData.nouveautes.toString());
    formData.append('remise', productData.remise.toString());
    
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('images', file, file.name);
      });
    }
    
    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByCategory(categoryId: number): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
}

  getNouveautes(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/nouveautes`);
  }

  getNouveautesByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/nouveautes/category/${categoryId}`);
  }

}