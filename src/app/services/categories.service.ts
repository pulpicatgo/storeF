import { Injectable } from '@angular/core';
import { onSnapshot } from '@angular/fire/firestore';
import { collection, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Categories } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private firestore: Firestore) { }

  get categories$(): Observable<Categories[]> {
    const list: Categories[] = [];
    return new Observable(observer => {
      return onSnapshot(collection(this.firestore, "categories"), (snapshot => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            list.push(change.doc.data() as Categories)
          }
          if (change.type === "modified") {
            var index = list.findIndex(p => p.category === change.doc.data()['category'])
            list[index] = change.doc.data() as Categories
          }
          if (change.type === "removed") {
            var index = list.findIndex(p => p.category === change.doc.data()['category'])
            list.splice(index, 1)
          }
          console.log(list)
        },
          observer.next(list))
      }),
        (error => observer.error(error.message)))
    })

  }
}
