import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { Cart, CartItem } from 'src/app/models/cart';
import { CartService } from 'src/app/services/cart.service';
import { UsersService } from 'src/app/services/users.service';
import Swal from 'sweetalert2';


@UntilDestroy(this)
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(private cartService: CartService, private usersService: UsersService, private changeDetectorRef: ChangeDetectorRef) {

  }

  user$ = this.usersService.currentUserProfile$
  displayedColumns: string[] = ['imageUrl', 'nombreProd', 'marca', 'precio', 'cantidadCompra', 'total'];
  public dataSource = new MatTableDataSource<Cart>([]);
  cart$ = this.cartService.getcurrentUserCart$()
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  dataObs$!: Observable<any>;
  ngOnInit() {
    this.cartService.getcurrentUserCart$().pipe(untilDestroyed(this)).subscribe((data) => {
      const dataTable = data![0].productos! ?? [];
      this.dataSource = new MatTableDataSource<any>(dataTable)
      this.changeDetectorRef.detectChanges();
      setTimeout(() => this.dataSource.paginator = this.paginator)
      this.dataObs$ = this.dataSource.connect()
    });

  }


  calculateTotal(cartItem: CartItem) {
    return cartItem.cantidadCompra! * cartItem.precio! ?? 0.0
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  comprar(cart: Cart) {
    Swal.fire({
      title: '¿Estás seguro de que quiere continuar la compra?',
      text: "Seleccione una opción para continuar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.comprar(cart).subscribe(() =>
        Swal.fire(
          'Compra realizada!',
          'Tu pedido ha sido recibido, pronto nos pondremos en contacto!',
          'success'
        )
        );
      }
    })
  }
  calculateTotalTotal(cart: Cart) {
    let total = 0;
    cart.productos!.forEach((p) => total += p.cantidadCompra! * p.precio!)
    return total;
  }
}


