import { Component, OnInit } from '@angular/core';
import { CategoryService } from './../../Service/category/category.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Product } from 'src/app/Models/product';
import { ProductService } from 'src/app/Service/Product/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
 listproduit: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAll().subscribe({
      next: (products) => {
        this.listproduit = products;
        this.filteredProducts = products;
        this.isLoading = false;
        console.log('Produits chargés:', products);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits', error);
        this.isLoading = false;
        alert('Erreur lors du chargement des produits');
      }
    });
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          console.log('Produit supprimé avec succès');
          // Recharger la liste après suppression
          this.loadProducts();
          alert('Produit supprimé avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          alert('Erreur lors de la suppression du produit');
        }
      });
    }
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    
    if (this.searchTerm === '') {
      this.filteredProducts = this.listproduit;
    } else {
      this.filteredProducts = this.listproduit.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm) ||
        product.description?.toLowerCase().includes(this.searchTerm) ||
        product.category.name.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  editProduct(id: number): void {
    this.router.navigate(['/UpdateProduct', id]);
  }
}