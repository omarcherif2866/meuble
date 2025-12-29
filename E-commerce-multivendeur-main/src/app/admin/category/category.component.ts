import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/Models/category';
import { CategoryService } from 'src/app/Service/category/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  listcategorys: Category[] = [];
  filteredCategorys: Category[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategorys();
  }

  loadCategorys(): void {
    this.isLoading = true;
    this.categoryService.getAll().subscribe({
      next: (categorys) => {
        this.listcategorys = categorys;
        this.filteredCategorys = categorys;
        this.isLoading = false;
        console.log('categorys chargés:', categorys);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des categorys', error);
        this.isLoading = false;
        alert('Erreur lors du chargement des categorys');
      }
    });
  }

  delete(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce category ?')) {
      this.categoryService.delete(id).subscribe({
        next: () => {
          console.log('category supprimé avec succès');
          // Recharger la liste après suppression
          this.loadCategorys();
          alert('category supprimé avec succès!');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          alert('Erreur lors de la suppression du category');
        }
      });
    }
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    
    if (this.searchTerm === '') {
      this.filteredCategorys = this.listcategorys;
    } else {
      this.filteredCategorys = this.listcategorys.filter(category =>
        category.name.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  editCategory(id: number): void {
    this.router.navigate(['/UpdateCategory', id]);
  }
}