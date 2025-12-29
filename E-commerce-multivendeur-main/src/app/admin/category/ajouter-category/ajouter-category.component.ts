import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from 'src/app/Models/category';
import { CategoryService } from 'src/app/Service/category/category.service';

@Component({
  selector: 'app-ajouter-category',
  templateUrl: './ajouter-category.component.html',
  styleUrls: ['./ajouter-category.component.css']
})
export class AjouterCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  categories: Category[] = [];
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
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
    if (this.categoryForm.invalid) {
      console.log('Formulaire invalide');
      return;
    }

    if (this.selectedImages.length === 0) {
      alert('Veuillez sélectionner au moins une image');
      return;
    }

    const formValue = this.categoryForm.value;

    this.categoryService.create(formValue, this.selectedImages).subscribe({
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
    this.categoryForm.reset({
      nouveautes: false,
      remise: false
    });
    this.selectedImages = [];
    this.imagePreviewUrls = [];
  }
}


