import { Component, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

import { AuthService } from 'src/app/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/services/users.service';
import { CartService } from 'src/app/services/cart.service';

@UntilDestroy()
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav


  user$ = this.usersService.currentUserProfile$;
  cart$ = this.cartService.getcurrentUserCart$()
  constructor(private cartService: CartService, private authService: AuthService, private usersService: UsersService, private breakObserver: BreakpointObserver, private router: Router) {

  }

  ngAfterViewInit() {
    this.breakObserver.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = "over";
        this.sidenav.close();
      } else {
        this.sidenav.mode = "side";
        this.sidenav.open()
      }
    })

    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd), untilDestroyed(this)
    ).subscribe(() => {
      if (this.sidenav.mode === 'over') {
        this.sidenav.close();
      }
    });

  }
  ngOnInit(): void {

  }

  public showLoginDialog() {
    Swal.fire({
      title: '<strong>Inicio de sesión</strong>',
      icon: 'question',
      html:
        '¿Cómo quieres iniciar sesión?',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Celular',
      denyButtonText: 'Correo',
      denyButtonColor: '#be4b16'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.router.navigate(['/login-otp']);
      } else if (result.isDenied) {
        this.router.navigate(['/login']);
      }
    })
  }

  logout() {
    Swal.fire({
      title: '¿Estás seguro de que quiere cerrar sesión?',
      text: "Seleccione una opción para continuar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar Sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe(() =>
          this.router.navigate(['/home'])
        );
      }
    })
  }

  redirectHome(query: string) {
    this.router.navigate(['/products/' + query])
  }

}

