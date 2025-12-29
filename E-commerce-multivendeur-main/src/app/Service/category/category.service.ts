import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from 'src/app/Models/category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
private apiUrl = 'http://localhost:9090/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  create(categoryData: any, imageFiles: File[]): Observable<Category> {
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('name', categoryData.name);

    
    // Ajouter les images
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('image', file, file.name);
      });
    }
    
    return this.http.post<Category>(this.apiUrl, formData);
  }

  update(id: number, categoryData: any, imageFiles?: File[]): Observable<Category> {
    const formData = new FormData();
    
    formData.append('name', categoryData.name);
    
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append('image', file, file.name);
      });
    }
    
    return this.http.put<Category>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

