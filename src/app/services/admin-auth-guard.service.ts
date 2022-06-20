import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {

  constructor(private usersService: UsersService, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.usersService.currentUserProfile$.pipe(
      map((appUser) => {
        if (appUser?.isAdmin) {
          return true;
        }
        this.router.navigate(['/home']);
        return false;
      }));
  }
}