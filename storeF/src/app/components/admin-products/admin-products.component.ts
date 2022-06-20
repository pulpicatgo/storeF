import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource, _MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { ProductsService } from 'src/app/services/products.service';
import Swal from 'sweetalert2';
import { EditProductComponent } from '../edit-product/edit-product.component';

@UntilDestroy()
@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  displayedColum: string[] = [ 'nombreProd', 'marca', 'precio', 'categoria', 'imageUrl', 'cantidad', 'edit']

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  productsList$ = this.productsService.ProductsSystem$
  dataSource = new MatTableDataSource<Product>([])
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(private productsService: ProductsService, private toast: HotToastService, private dialog: MatDialog, private imageUploadService: ImageUploadService) { }

  ngOnInit(): void {
    this.productsService.ProductsSystem$.pipe(untilDestroyed(this)).subscribe((data) => {
      
      this.dataSource = new MatTableDataSource(data);
      setTimeout(() => this.dataSource.paginator = this.paginator)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(product: Product) {
    this.productsService.setDataToFormGroup(product)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width= "80%";
    this.dialog.open(EditProductComponent,dialogConfig);
  }

  addProduct(){
    this.productsService.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width= "80%";
    this.dialog.open(EditProductComponent,dialogConfig);
  }

  deleteProduct(product: Product) {
    Swal.fire({
      title: '¿Estás seguro de que quiere eliminar el producto \'' + product.nombreProd + '\'?',
      text: "Seleccione una opción para continuar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productsService.deleteProduct(product).pipe(
          this.toast.observe(
            {
              loading: "Eliminando producto",
              error: "Tuvimos un error",
              success: 'Eliminado correctamente'
            }
          )
        ).subscribe()
      }
    })
  }

  editPicture(event:any,product:Product){
    const productId = product.productId;
    this.imageUploadService
    .uploadImage(event.target.files[0], `images/products/${product.productId}`)
    .pipe(
      this.toast.observe({
        loading: 'Subiendo imagen del producto...',
        success: 'Imagen subida correctamente',
        error: 'Ocurrió un problema :c',
      }),
      switchMap((imageUrl) =>
        this.productsService.updateProduct({
          productId,
          imageUrl,
        })
      )
    )
    .subscribe();
  }
}
