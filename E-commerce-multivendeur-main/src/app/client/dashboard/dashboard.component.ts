import { Component, OnInit, Renderer2 } from '@angular/core';
import { ScriptService } from '../../Service/script/script.service';
import { HttpClient } from '@angular/common/http';
import { Emitters } from 'src/app/emitters/emitter';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client';
import { SocketIOServiceService } from 'src/app/Service/SocketIOService/socket-ioservice.service';
import { CookieService } from 'ngx-cookie-service';
import { Product } from 'src/app/Models/product';
import { ProductService } from 'src/app/Service/Product/product.service';

const SCRIPT_PATH_LIST = ['assets/client/js/script.js'];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  message!: number;
  api = 'http://localhost:3000/';
  list: any;
  ListCategorie: any;
  authenticated!: false;
  nouveautes: Product[] = [];
  isLoading: boolean = false;
  constructor(
    private router: Router,
    route: ActivatedRoute,
    private renderer: Renderer2,
    private ScriptServiceService: ScriptService,
    private http: HttpClient,
    private toastr: ToastrService,
    private productService: ProductService,
    private SocketIOServiceService: SocketIOServiceService,
    private cookieService: CookieService
  ) {}

  ngOnInit() {

    this.loadNouveautes();

    // this.socket.on('ban', (data) => {
    //   if (data == 'user ban') {
    //     this.toastr.error('Vous êtes banni', 'Erreur', {
    //       timeOut: 3000,
    //       progressBar: true,
    //       progressAnimation: 'increasing',
    //       positionClass: 'toast-top-right',
    //     });
    //   }

    // });

    SCRIPT_PATH_LIST.forEach((e) => {
      const scriptElement = this.ScriptServiceService.loadJsScript(
        this.renderer,
        e
      );
      scriptElement.onload = () => {
        // this.showallCat();
        // this.showAllProduit();

        console.log('loaded');
      };
      scriptElement.onerror = () => {
        console.log('Could not load the script!');
      };
    });
    // refresh page after add produit to panier

    this.http.get('api/auth/getUser', { withCredentials: true }).subscribe(
      (res: any) => {
        let str = 'http://localhost:4200/' + 'api' + '/' + res.image;
        this.message = res.id;
        // this.message = `${this.api+res.image}`;
        // how show image in toast angular 13 ?
        this.SocketIOServiceService.emit('message', res.id);

        Emitters.authEmitter.emit(true);
      },
      (err) => {
        Emitters.authEmitter.emit(false);
      }
    );
  }

  // showallCat() {
  //   this.http.get('api/categories/affichercategorie').subscribe((data: any) => {
  //     this.ListCategorie = data;
  //     console.log(this.ListCategorie);
  //   });
  // }
  // showAllProduit() {
  //   this.http.get('api/produit/afficherAllProduit').subscribe((data: any) => {
  //     try {
  //       this.list = data;
  //       console.log(this.list);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // }

  // ajouterPanier(id: number, idProduit: number, prix: number) {
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
  //     this.router.navigate(['/login']);
  //   }

  //   this.http
  //     .post('api/panier/ajouterPanier', {
  //       id: id,
  //       idProduit: idProduit,
  //       prix: prix,
  //     })
  //     .subscribe(
  //       (data: any) => {
  //         this.toastr.success('Produit ajouté au panier', 'Succès', {
  //           timeOut: 3000,
  //           progressBar: true,
  //           progressAnimation: 'increasing',
  //           positionClass: 'toast-top-right',
  //         });
  //         // how refresh component headercomponent  after add produit to panier angular 13 ?

  //         this.SocketIOServiceService.emit('idusercountprdouit', id);
  //       },
  //       (error) => {
  //      if (error.status == 401) {
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

  loadNouveautes(): void {
    this.isLoading = true;
    this.productService.getNouveautes().subscribe({
      next: (products) => {
        this.nouveautes = products;
        this.isLoading = false;
        console.log('Nouveautés chargées:', products);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des nouveautés', error);
        this.isLoading = false;
        alert('Erreur lors du chargement des nouveautés');
      }
    });
  }

  viewProduct(id: number | undefined): void {
    if (!id) return;
    this.router.navigate(['/singleProduct', id]);
  }
}

// use guard in angular 13  to protect routes in angular 13
//
//
//
//
// how replace  /  with  \  in angular 13 ?
