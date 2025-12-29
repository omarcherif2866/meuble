import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/Models/category';
import { CategoryService } from 'src/app/Service/category/category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css']
})
export class UpdateCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  category?: Category
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  existingImages: string[] = [];
  categoryId!: number;
  isLoading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    // Récupérer l'ID du category depuis l'URL
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId) {
        this.loadCategory();
      }
    });
    
  }

  loadCategory(): void {
    this.isLoading = true;
    this.categoryService.getById(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        this.existingImages = category.image || [];
        
        // Remplir le formulaire avec les données existantes
        this.categoryForm.patchValue({
          name: category.name,

        });
        
        this.isLoading = false;
        console.log('category chargé:', category);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du category', error);
        alert('Erreur lors du chargement du category');
        this.isLoading = false;
        this.router.navigate(['/category']);
      }
    });
  }


  onFileSelected(event: any): void {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      this.selectedImages = Array.from(files);
      
      // Créer des aperçus des nouvelles images
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

  removeNewImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  removeExistingImage(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      this.existingImages.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      console.log('Formulaire invalide');
      Object.keys(this.categoryForm.controls).forEach(key => {
        const control = this.categoryForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }

    // Si aucune nouvelle image et aucune image existante
    if (this.selectedImages.length === 0 && this.existingImages.length === 0) {
      alert('Veuillez sélectionner au moins une image');
      return;
    }

    this.isLoading = true;
    const formValue = this.categoryForm.value;

    this.categoryService.update(this.categoryId, formValue, this.selectedImages).subscribe({
      next: (response) => {
        console.log('category mis à jour avec succès', response);
        alert('category mis à jour avec succès!');
        this.isLoading = false;
        this.router.navigate(['/categorys']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du category', error);
        alert('Erreur lors de la mise à jour du category: ' + (error.error || error.message));
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler les modifications ?')) {
      this.router.navigate(['/categorys']);
    }
  }

  compareCategory(c1: Category, c2: Category): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}