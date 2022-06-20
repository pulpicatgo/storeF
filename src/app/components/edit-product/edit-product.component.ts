import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { CategoriesService } from 'src/app/services/categories.service';
import { ProductsService } from 'src/app/services/products.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  categories$ = this.categoriesService.categories$

  constructor(private productsService: ProductsService, private categoriesService: CategoriesService, private toast: HotToastService, private router: Router, public dialogRef: MatDialogRef<EditProductComponent>) { }

  form = this.productsService.form;
  addProduct() {
    console.log(this.form.value)
    const productData = this.form.value;
    if (productData.productId == null) {
      this.productsService.addProduct(productData).pipe(
        this.toast.observe({
          loading: 'Creando Producto...',
          success: 'Producto creado',
          error: 'Tuvimos un error al crear el producto',
        })
      )
        .subscribe(() => {
          this.router.navigate(['/adminProducts'])
          this.onClose();
        }
        );
    }
    else {
      this.productsService.updateProduct(productData).pipe(
        this.toast.observe({
          loading: 'Actualizando datos del producto...',
          success: 'Producto Actualizado',
          error: 'Tuvimos un error :(',
        })
      )
        .subscribe(() => {
          this.router.navigate(['/adminProducts']);
          this.onClose();
        }
        );
    }
  }
  onClose() {
    this.productsService.form.reset();
    this.productsService.initializeFormGroup();
    this.dialogRef.close()
  }
  ngOnInit(): void {
  }

}
