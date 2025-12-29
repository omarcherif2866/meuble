import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/Models/category';
import { Product } from 'src/app/Models/product';
import { CategoryService } from 'src/app/Service/category/category.service';
import { ProductService } from 'src/app/Service/Product/product.service';


@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  existingImages: string[] = [];
  productId!: number;
  isLoading: boolean = false;
  product?: Product;


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
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
    // Récupérer l'ID du produit depuis l'URL
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      if (this.productId) {
        this.loadProduct();
      }
    });
    
    this.loadCategories();
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.existingImages = product.images || [];
        
        // Remplir le formulaire avec les données existantes
        this.productForm.patchValue({
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description,
          nouveautes: product.nouveautes,
          remise: product.remise
        });
        
        this.isLoading = false;
        console.log('Produit chargé:', product);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du produit', error);
        alert('Erreur lors du chargement du produit');
        this.isLoading = false;
        this.router.navigate(['/products']);
      }
    });
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
    if (this.productForm.invalid) {
      console.log('Formulaire invalide');
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
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
    const formValue = this.productForm.value;

    this.productService.update(this.productId, formValue, this.selectedImages).subscribe({
      next: (response) => {
        console.log('Produit mis à jour avec succès', response);
        alert('Produit mis à jour avec succès!');
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du produit', error);
        alert('Erreur lors de la mise à jour du produit: ' + (error.error || error.message));
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler les modifications ?')) {
      this.router.navigate(['/products']);
    }
  }

  compareCategory(c1: Category, c2: Category): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}