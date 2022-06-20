import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, docData, Firestore, onSnapshot, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { from, Observable, of, switchMap } from 'rxjs';
import { Cart, CartItem } from '../models/cart';
import { Product } from '../models/product';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {


 
  //solo se elimina jaja, no dio tiempo para más
  comprar(cart: Cart): Observable<void> {
    return from(deleteDoc(doc(this.firestore, "carts", cart.cartId)))
  }

  constructor(private usersService: UsersService, private firestore: Firestore) { }


  getcurrentUserCart$(): Observable<Cart[] | null> {

    return this.usersService.currentUserProfile$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const list: Cart[] = [];
        const q = query(collection(this.firestore, "carts"), where("userId", "==", user?.uid));

        return new Observable<Cart[] | null>(observer => {
          return onSnapshot(q, (snapshot => {
            if (snapshot.empty) {
              this.createCartForCurrentUser(user.uid)
            }
            snapshot.docChanges().forEach((change) => {

              if (change.type === "added") {
                list.push(change.doc.data() as Cart)
              }
              if (change.type === "modified") {
                var index = list.findIndex(p => p.cartId === change.doc.data()['cartId'])
                list[index] = change.doc.data() as Cart
              }
              if (change.type === "removed") {
                var index = list.findIndex(p => p.cartId === change.doc.data()['cartId'])
                list.splice(index, 1)
              }
              console.log(list)
            },
              observer.next(list))
          }),
            (error => observer.error(error.message)))
        })
      }));
  }

  createCartForCurrentUser(userId: string) {
    console.log("creating cart")
    const newCart = doc(this.firestore, 'carts', userId);
    const cartId = newCart.id;
    const totalProductos = 0;
    const productos: Product[] = [];
    return from(setDoc(newCart, { cartId, userId, totalProductos, productos }));
  }

  gettotalProductsInCart(cart: Cart): number {
    let count = 0;
    if (cart != null) {
      cart.productos?.forEach(element =>
        count += element!.cantidadCompra!)
    }
    console.log("counter =" + count)
    return count;
  }
  addProductToCart(cart: Cart, product: Product): Observable<void> {
    if (cart.productos != null) {
      const index = cart.productos.findIndex(element => element.productId == product.productId)
      if (index == -1) {
        const cartItem: CartItem = { ...product, cantidadCompra: 1 };
        cart.productos.push(cartItem);
      }
      else {
        cart!.productos[index]!.cantidadCompra! += 1;
      }
    } else {
      cart
    }
    const total = this.gettotalProductsInCart(cart)
    cart.totalProductos = total;
    const ref = doc(this.firestore, 'carts', cart.cartId);
    return from(updateDoc(ref, { ...cart }))
  }

  removeProductFromCart(cart: Cart, product: Product): Observable<void> {

    if (cart.productos != null) {
      const index = cart.productos.findIndex(element => element.productId == product.productId)
      if (index != -1) {
        cart.productos[index].cantidadCompra! -= 1;
        if (cart.productos[index].cantidadCompra! <= 0) {
          cart.productos.splice(index, 1);
        }
      }
    }
    const total = this.gettotalProductsInCart(cart)
    cart.totalProductos = total
    const ref = doc(this.firestore, 'carts', cart.cartId);
    return from(updateDoc(ref, { ...cart }))
  }


}
