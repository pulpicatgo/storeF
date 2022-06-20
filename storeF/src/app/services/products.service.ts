import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, Firestore, getDocs, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { from, map, Observable } from 'rxjs';
import { Product } from '../models/product';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  form: FormGroup = new FormGroup({
    productId: new FormControl(null),
    nombreProd: new FormControl('', Validators.required),
    marca: new FormControl('', Validators.required),
    precio: new FormControl('', Validators.required),
    categorias: new FormControl('', Validators.required),
    cantidad: new FormControl('', Validators.required)
  })
  constructor(private firestore: Firestore) { }

  initializeFormGroup() {
    this.form.setValue({
      productId: null,
      nombreProd: '',
      marca: '',
      precio: 0,
      categorias: [],
      cantidad: 0
    })
  }

  setDataToFormGroup(product: Product){
    this.form.setValue( _.omit(product, 'imageUrl'));
  }
  addProduct(product: Product): Observable<void> {
    const newProduct = doc(collection(this.firestore, 'productos'))
    product.productId = newProduct.id
    return from(setDoc(newProduct, product));
  }

  updateProduct(product: Product): Observable<void> {
    const ref = doc(this.firestore, 'productos', product.productId);
    return from(updateDoc(ref, { ...product }).catch(
      (error) => {
        console.log("document do not exits.... creating");
        this.addProduct(product)
      }
    ));
  }

  deleteProduct(product: Product): Observable<void> {
    return from(deleteDoc(doc(this.firestore, "productos", product.productId)))
  }

  getAllProducts(): Observable<Product[]> {
    const list: Product[] = [];
    return from(getDocs(collection(this.firestore, "productos"))).pipe(
      map((docSnapshots) => {
        docSnapshots.forEach((doc) => list.push(doc.data() as Product))
        console.log(list)
        return list
      }
      ))
  }

  get ProductsSystem$(): Observable<Product[]> {
    const list: Product[] = [];

    return new Observable(observer => {
      return onSnapshot(collection(this.firestore, "productos"), (snapshot => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            list.push(change.doc.data() as Product)
          }
          if (change.type === "modified") {
            var index = list.findIndex(p => p.productId === change.doc.data()['productId'])
            list[index] = change.doc.data() as Product
          }
          if (change.type === "removed") {
            var index = list.findIndex(p => p.productId === change.doc.data()['productId'])
            list.splice(index, 1)
          }
          console.log(list)
        },
          observer.next(list))
      }),
        (error => observer.error(error.message)))
    })

  }

  ProductsAsMatTableDataSource$: Observable<MatTableDataSource<Product>> =
    this.ProductsSystem$.pipe(
      map(things => {
        const dataSource = new MatTableDataSource<Product>();
        dataSource.data = things;
        return dataSource;
      }));

  populateForm(product: Product) {
    this.form.patchValue({ ...product })
  }
}
