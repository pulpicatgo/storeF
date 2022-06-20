import { Injectable } from '@angular/core';
import { collection, doc, docData, Firestore, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { from, Observable, of, switchMap } from 'rxjs';
import { ProfileUser } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: Firestore, private authService: AuthService) { }

  get currentUserProfile$(): Observable<ProfileUser | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        const ref = doc(this.firestore, 'users', user?.uid);
        return docData(ref) as Observable<ProfileUser>;
      })
    );
  }

  addUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: ProfileUser): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }).catch(
      (error) => {
        console.log("document do not exits.... creating");
        this.addUser(user)
      }
    ));
  }

  get usersList$(): Observable<ProfileUser[]> {
    const list: ProfileUser[] = [];
    return new Observable(observer => {
      return onSnapshot(collection(this.firestore, "users"), (snapshot => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            list.push(change.doc.data() as ProfileUser)
          }
          if (change.type === "modified") {
            var index = list.findIndex(p => p.uid === change.doc.data()['uid'])
            list[index] = change.doc.data() as ProfileUser
          }
          if (change.type === "removed") {
            var index = list.findIndex(p => p.uid === change.doc.data()['uid'])
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
