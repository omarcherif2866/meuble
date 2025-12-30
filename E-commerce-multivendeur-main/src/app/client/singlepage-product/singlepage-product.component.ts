import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ScriptService } from '../../Service/script/script.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Emitters } from 'src/app/emitters/emitter';
import { Observable, filter } from 'rxjs';
import { SocketIOServiceService } from 'src/app/Service/SocketIOService/socket-ioservice.service';
import { Category } from 'src/app/Models/category';
import { ProductService } from 'src/app/Service/Product/product.service';
import { CategoryService } from 'src/app/Service/category/category.service';
import { Cart, CartItem } from 'src/app/Models/cart';
import { CartService } from 'src/app/Service/cart/cart.service';
import { Product } from 'src/app/Models/product';
import { AuthService } from 'src/app/Service/Auth/auth.service';
const SCRIPT_PATH_LIST = [
  'assets/client/js/jquery-3.3.1.min.js',

  'assets/client/js/menu.js',

  'assets/client/js/lazysizes.min.js',

  'assets/client/js/price-range.js',

  'assets/client/js/slick.js',

  'assets/client/js/bootstrap.bundle.min.js',

  'assets/client/js/bootstrap-notify.min.js',

  'assets/client/js/theme-setting.js',
  'assets/client/js/script.js',
];

@Component({
  selector: 'app-singlepage-product',
  templateUrl: './singlepage-product.component.html',
  styleUrls: ['./singlepage-product.component.css'],
})
export class SinglepageProductComponent implements OnInit {
  @ViewChild('inputnoter1') inputnoter1!: ElementRef;
  @ViewChild('inputnoter2') inputnoter2!: ElementRef;
  @ViewChild('inputnoter3') inputnoter3!: ElementRef;
  @ViewChild('inputnoter4') inputnoter4!: ElementRef;
  @ViewChild('inputnoter5') inputnoter5!: ElementRef;

  id: any;
  data: any = {};
  @Input() product: Product | undefined;
  itemsQuantity = 0;
  private _cart: Cart = { items: [] };
  category$!: Observable<Category>;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;
    this.itemsQuantity = cart.items.map((item) => item.quantity).reduce((prev, current) => prev + current, 0);
  }



    userId: number | null = null;
  authenticated = false;

  message: any;
  public route: any = '';
  idproduitss: any;
  nom: any;
  prix: any;
  image: any;
  Description: any;
  quantite: any;
  promotion: any;
  date_exp: any;
  prixold: any;
  numberpromotion: any;
  image2: any;
  idProduit: any;
  countlike: any;
  numberRate: number = 0;
  constructor(
    private ScriptServiceService: ScriptService,
    private _router: Router,
    private renderer: Renderer2,
    private service: ProductService,
    private categoryService:CategoryService,
    private authService:AuthService,

    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private http: HttpClient,
    private currentRoute: ActivatedRoute,
    private router: Router,
    private SocketIOServiceService: SocketIOServiceService
  ) {
    this.route = this._router.url;

  }

  ngOnInit() {

    console.log(this.route);
    const segments = this.route.split('/');
    this.id = segments[segments.length - 1]; // Initialisation de this.id avec l'ID extrait de l'URL
    console.log(this.id);
    this.getProducts();
       this.checkAuthentication();

  }
  // ajouterPanier(id: any, idProduit: number, prix: number) {
  //   if (id == null) {
  //     this.toastr.error(
  //       'Vous devez vous connecter pour ajouter au panier',
  //       'Erreur',
  //       {
  //         timeOut: 3000,
  //         progressBar: true,
  //         progressAnimation: 'increasing',
  //         positionClass: 'toast-top-right',
  //       }
  //     );
  //     this._router.navigate(['/login']);
  //   }
  //   this.http
  //     .post('api/panier/ajouterPanier', {
  //       id: id,
  //       idProduit: idProduit,
  //       prix: prix,
  //     })
  //     .subscribe(
  //       (data: any) => {
  //         this.toastr.success(
  //           'Produit ajouté au panier avec succès',
  //           'Ajouté au panier',
  //           {
  //             timeOut: 3000,
  //             progressBar: true,
  //             progressAnimation: 'increasing',
  //             positionClass: 'toast-top-right',
  //           }
  //         );
  //         this.ngOnInit();
  //         this.SocketIOServiceService.emit('idusercountprdouit', id);
  //       },
  //       (error: any) => {
  //         if (error.status == 401) {
  //           this.toastr.error('Produit déjà dans le panier', 'Erreur', {
  //             timeOut: 3000,
  //             progressBar: true,
  //             progressAnimation: 'increasing',
  //             positionClass: 'toast-top-right',
  //           });

  //         }else if (error.status == 400) {
  //           this.toastr.error('Produit hors stock', 'Erreur', {
  //             timeOut: 3000,
  //             progressBar: true,
  //             progressAnimation: 'increasing',
  //             positionClass: 'toast-top-right',
  //           });

  //         }
  //         else{
  //           this.toastr.warning('Serveur indisponible', 'Erreur', {
  //             timeOut: 3000,
  //             progressBar: true,
  //             progressAnimation: 'increasing',
  //             positionClass: 'toast-top-right',
  //           });
  //         }

  //       }
  //     );
  // }
  
  jaime(id: number, idProduit: number) {
    if (this.message == null) {
      this.toastr.error('Vous devez vous connecter', 'Erreur', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
      this._router.navigate(['/login']);
    }

    this.http
      .post('api/like/ajouterlike', { id_user: id, id_produit: idProduit })
      .subscribe(
        (data: any) => {
          if (data.message == 'like ajouté') {
            this.toastr.success('Vous aimez ce produit', 'Ajouté au panier', {
              timeOut: 3000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            });
            this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
              window.location.reload();
            });
          } else {
            this.toastr.error('Vous n aimez pas ce produit', 'Erreur', {
              timeOut: 3000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right',
            });
          }
          this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
            window.location.reload();
          });
        },
        (err: any) => {
          this.toastr.error('Vous devez vous connecter', 'Erreur', {
            timeOut: 3000,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right',
          });
        }
      );
    this.ngOnInit();
  }

  noterProduit(id: number, idProduit: number) {
    if (
      this.inputnoter1.nativeElement.checked == false &&
      this.inputnoter2.nativeElement.checked == false &&
      this.inputnoter3.nativeElement.checked == false &&
      this.inputnoter4.nativeElement.checked == false &&
      this.inputnoter5.nativeElement.checked == false
    ) {
      this.toastr.error('Vous devez choisir une note', 'Erreur', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
    }

    if (this.inputnoter1.nativeElement.checked == true) {
      console.log(this.inputnoter1.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter1.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }
    if (this.inputnoter2.nativeElement.checked == true) {
      console.log(this.inputnoter2.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter2.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }
    if (this.inputnoter3.nativeElement.checked == true) {
      console.log(this.inputnoter3.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter3.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }

    if (this.inputnoter4.nativeElement.checked == true) {
      console.log(this.inputnoter4.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter4.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }

    if (this.inputnoter5.nativeElement.checked == true) {
      console.log(this.inputnoter5.nativeElement.value);
      this.http
        .post('api/noterproduit/ajouterRate', {
          id_user: id,
          id_produit: idProduit,
          noter: this.inputnoter5.nativeElement.value,
        })
        .subscribe((data: any) => {
          if (data.message == 'note ajoutée') {
            this.toastr.success(
              'Vous aimez noter ce produit',
              'noter Produit',
              {
                timeOut: 3000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right',
              }
            );
          }
        });
      this.router.navigate(['/singleProduct/' + idProduit]).then(() => {
        window.location.reload();
      });
    }
  }



  getPlatImageUrl(images: string): string {
    // Vérifiez si data.image existe avant de construire l'URL
    return this.data.image ? `http://localhost:9090/img/${this.data.image}` : '';
  }

  getProducts() {
    this.service.getById(this.id).subscribe(
      (res) => {
        this.data = res;
        console.log('Product details:', this.data);
        this.category$ = this.categoryService.getById(this.data.category);
        this.category$.subscribe(category => {
          this.data.category = category;
        });
        console.log("Product with category:", this.data);
      },
      (error) => {
        console.error("Error fetching product:", error);
      }
    );
  }


  checkAuthentication(): void {
    // Essayer d'abord de récupérer l'ID depuis le token JWT
    this.userId = this.authService.getUserIdFromToken();
    
    // Si pas trouvé dans le token, essayer localStorage
    if (!this.userId) {
      const storedUserId = localStorage.getItem('user_id');
      this.userId = storedUserId ? parseInt(storedUserId) : null;
    }
    
    // Vérifier si l'utilisateur est connecté
    if (this.userId) {
      this.authenticated = true;
    } else {
      // Si toujours pas d'ID, vérifier auprès du serveur
      this.http.get('http://localhost:9090/api/auth/getUser', { withCredentials: true }).subscribe(
        (user: any) => {
          if (user && user.id) {
            this.authenticated = true;
            this.userId = user.id;
            // Optionnel: sauvegarder dans localStorage pour usage futur
            localStorage.setItem('user_id', user.id.toString());
          } else {
            this.authenticated = false;
            this.userId = null;
          }
        },
        (error) => {
          this.authenticated = false;
          this.userId = null;
        }
      );
    }
  }

ajouterAuPanier(): void {
  let currentUserId = this.userId;
  
  if (!currentUserId) {
    currentUserId = this.authService.getUserIdFromToken();
    
    if (!currentUserId) {
      const storedUserId = localStorage.getItem('user_id');
      currentUserId = storedUserId ? parseInt(storedUserId) : null;
    }
  }

  if (!currentUserId) {
    this.toastr.warning('Veuillez vous connecter pour ajouter des produits au panier');
    this.router.navigate(['/login']);
    return;
  }

  if (!this.data || !this.data.id) {
    this.toastr.error('Erreur: Données du produit non disponibles');
    return;
  }

  if (!this.data.quantite || this.data.quantite <= 0) {
    this.toastr.error('Produit en rupture de stock');
    return;
  }

  this.http.post(`http://localhost:9090/api/cart/add`, null, {
    params: {
      userId: currentUserId.toString(),
      productId: this.data.id.toString(),
      quantity: '1'
    }
  }).subscribe(
    (response: any) => {
      this.toastr.success('Produit ajouté au panier avec succès');
      
      // Vérification de currentUserId avant l'appel
      if (currentUserId !== null) {
        this.refreshCart(currentUserId);
        this.SocketIOServiceService.emit('updateCart', currentUserId);
      }
    },
    (error) => {
      if (error.status === 400) {
        this.toastr.error('Stock insuffisant ou erreur lors de l\'ajout au panier');
      } else {
        this.toastr.error('Erreur lors de l\'ajout au panier');
      }
      console.error('Erreur:', error);
    }
  );
}

// Changez le paramètre pour accepter number (pas null)
refreshCart(userId: number): void {
  this.http.get(`http://localhost:9090/api/cart/${userId}`, {
    responseType: 'text' // Récupérer comme texte d'abord
  }).subscribe({
    next: (response: string) => {
      try {
        // Essayer de parser le JSON
        const cartData = JSON.parse(response);
        console.log('Données du panier reçues:', cartData);
        
        let items: CartItem[] = [];
        
        if (cartData && Array.isArray(cartData.items)) {
          items = cartData.items.map((item: any) => ({
            id: item.productId || item.id,
            name: item.productName || item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            category: item.category,
            description: item.description,
            vendorId: item.vendorId
          }));
        }
        
        const cart: Cart = { items };
        this.cartService.updateCart(cart);
      } catch (e) {
        console.error('Erreur de parsing JSON:', e);
        console.error('Réponse brute:', response);
        // Panier vide en cas d'erreur
        this.cartService.updateCart({ items: [] });
      }
    },
    error: (error) => {
      console.error('Erreur HTTP:', error);
      this.cartService.updateCart({ items: [] });
    }
  });
}

}
