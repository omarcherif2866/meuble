import { Component, OnInit, Renderer2, ElementRef, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/Service/category/category.service';
import { Subscription } from 'rxjs';
import { ProductService } from 'src/app/Service/Product/product.service';
import { Category } from 'src/app/Models/category';

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 350 };

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: any;
  categories: Category[] | undefined;
  seachComponent: boolean = false;
  keyword: string = '';
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  productsSubscription: Subscription | undefined;
  count = '12';
  selectedCategory: Category | null = null;
  
  @Output() showCategory = new EventEmitter();

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private el: ElementRef,
    private route: ActivatedRoute  // Ajout pour lire les paramètres de l'URL
  ) { }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data;
    });

    // Vérifier s'il y a un paramètre categoryId dans l'URL
    this.route.queryParams.subscribe(params => {
      const categoryId = params['categoryId'];
      const categoryName = params['categoryName'];
      
      if (categoryId) {
        // Charger les produits de la catégorie spécifiée
        this.loadProductsByCategory(+categoryId);
        
        // Mettre à jour la catégorie sélectionnée
        if (this.categories) {
          this.selectedCategory = this.categories.find(c => c.id === +categoryId) || null;
        }
        
        this.activeAll = false;
        this.activeIndex = categoryId;
      } else {
        // Charger tous les produits par défaut
        this.getAllProducts();
      }
    });

    // Gestion de la recherche
    var search: string = new URLSearchParams(window.location.search).get('q') || '';
    if (search) {
      this.keyword = search;
      this.seachComponent = true;
    }
  }

  activeIndex: any;
  activeAll: boolean = true;
  products_all: any;

  onShowCategory(category: Category) {
    this.selectedCategory = category;
    this.activeAll = false;
    this.activeIndex = category.id;
    this.showCategory.emit(category.name);
    this.loadProductsByCategory(category.id);
  }

  loadProductsByCategory(categoryId: number) {
    this.productService.getByCategory(categoryId).subscribe({
      next: (res) => {
        this.products = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  sortProducts(sortOption: any) {
    const selectedValue = sortOption.target.value;
    switch (selectedValue) {
      case 'menu_order':
        this.products.sort((a: any, b: any) => (a.id - b.id));
        break;
      case 'date':
        this.products.sort((a: any, b: any) => (b.id - a.id));
        break;
      case 'price':
        this.products.sort((a: any, b: any) => a.price - b.price);
        break;
      case 'price-desc':
        this.products.sort((a: any, b: any) => b.price - a.price);
        break;
    }
  }

  getAllProducts() {
    this.activeAll = true;
    this.activeIndex = null;
    this.selectedCategory = null;
    
    this.productsSubscription = this.productService.getAll().subscribe((_products) => {
      this.products = _products;
      this.cdr.detectChanges();
    });
  }
}