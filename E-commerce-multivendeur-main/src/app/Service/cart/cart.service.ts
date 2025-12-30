import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from 'src/app/Models/cart';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubjectInternal = new BehaviorSubject<Cart>({ items: [] });
  public cartSubject = this.cartSubjectInternal.asObservable();
  
  // Ajoutez cet alias pour la compatibilité
  public cart = this.cartSubject;

  constructor(private http: HttpClient) {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubjectInternal.next(JSON.parse(savedCart));
    }
  }

  getCartValue(): Cart {
    return this.cartSubjectInternal.value;
  }

  updateCart(cart: Cart): void {
    this.cartSubjectInternal.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Version avec un seul paramètre pour la compatibilité
  addToCart(item: CartItem, vendorId?: any): void {
    const currentCart = this.cartSubjectInternal.value;
    const existingItem = currentCart.items.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      currentCart.items.push(item);
    }

    this.updateCart(currentCart);
  }

  removeFromCart(item: CartItem): void {
    const currentCart = this.cartSubjectInternal.value;
    currentCart.items = currentCart.items.filter(i => i.id !== item.id);
    this.updateCart(currentCart);
  }

  // Ajoutez cette méthode pour réduire la quantité
  removeQuantity(item: CartItem): void {
    const currentCart = this.cartSubjectInternal.value;
    const existingItem = currentCart.items.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity -= 1;
      if (existingItem.quantity <= 0) {
        this.removeFromCart(item);
      } else {
        this.updateCart(currentCart);
      }
    }
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Renommez ClearCart en clearCart (minuscule)
  clearCart(): void {
    this.updateCart({ items: [] });
  }

  // Ajoutez la méthode checkOut
  checkOut(data: any, clientId: any): Observable<any> {
    return this.http.post(`http://localhost:9090/api/checkout`, {
      ...data,
      clientId: clientId
    });
  }
}