import { Component, OnInit} from '@angular/core';

import {

  FormBuilder,
  FormGroup,
  Validators,

} from '@angular/forms';
import { Category } from 'src/app/Models/category';
import { Product } from 'src/app/Models/product';
import { CategoryService } from 'src/app/Service/category/category.service';
import { ProductService } from 'src/app/Service/Product/product.service';

@Component({
  selector: 'app-ajouter-product',
  templateUrl: './ajouter-product.component.html',
  styleUrls: ['./ajouter-product.component.css'],
})
export class AjouterProductComponent implements OnInit {
   productForm: FormGroup;
  categories: Category[] = [];
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: [''],
      nouveautes: [false],
      remise: [false]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories', error);
      }
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      this.selectedImages = Array.from(files);
      
      // Créer des aperçus des images
      this.imagePreviewUrls = [];
      Array.from(files).forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    if (this.selectedImages.length === 0) {
      alert('Veuillez sélectionner au moins une image');
      return;
    }

    const formValue = this.productForm.value;

    this.productService.create(formValue, this.selectedImages).subscribe({
      next: (response) => {
        console.log('Produit ajouté avec succès', response);
        alert('Produit ajouté avec succès!');
        this.resetForm();
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du produit', error);
        alert('Erreur lors de l\'ajout du produit: ' + (error.error || error.message));
      }
    });
  }

  resetForm(): void {
    this.productForm.reset({
      nouveautes: false,
      remise: false
    });
    this.selectedImages = [];
    this.imagePreviewUrls = [];
  }
}


