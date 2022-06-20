import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { elementAt, Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { UsersService } from 'src/app/services/users.service';

@UntilDestroy(this)
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private cartService: CartService, private activetedRoute: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef, private usersService: UsersService, private toast: HotToastService, private productsService: ProductsService) { }

  products$!: Observable<any>;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Product>([])
  user$ = this.usersService.currentUserProfile$
  cart$ = this.cartService.getcurrentUserCart$()
  ngOnInit(): void {
    this.productsService.ProductsSystem$.pipe(untilDestroyed(this)).subscribe((data) => {

      this.dataSource = new MatTableDataSource(data);
      this.changeDetectorRef.detectChanges();
      this.products$ = this.dataSource.connect();
      setTimeout(() => this.dataSource.paginator = this.paginator)
    });
    this.activetedRoute.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.applyFilter(id)
      }
    );
    this.cartService.getcurrentUserCart$().pipe(untilDestroyed(this)).subscribe((cart) => {
      console.log(cart)
    })
  }
  gridColumns = 3;

  applyFilter(id: string) {
    if (!id) {
      return
    }
    this.dataSource.filter = id.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }

  addToCard(cart: Cart, product: Product) {
    this.cartService.addProductToCart(cart, product)
  }

  verifyIfProductAlreadyInCart(cart: Cart, product: Product){
    let index = -1;
    if(cart.productos!=null){
      index=cart.productos?.findIndex(element => element.productId == product.productId)
    }
    return index;
  }

  removeFromCard(cart: Cart, product: Product){
    this.cartService.removeProductFromCart(cart, product)
  }
  getCantidadEnCarro(cart: Cart, product:Product){
    const index = this.verifyIfProductAlreadyInCart(cart, product)
    if(cart.productos != null){
      return cart.productos[index].cantidadCompra;
    }
    else return 0;
  }
}
