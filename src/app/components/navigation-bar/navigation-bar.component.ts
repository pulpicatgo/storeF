import { Component, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

import { AuthService } from 'src/app/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit {

  @ViewChild(MatSidenav) sidenav!: MatSidenav

  constructor(private domSanitizer: DomSanitizer, private authService: AuthService, private breakObserver: BreakpointObserver, private router: Router) {

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

    this.router.events
    .pipe(
      untilDestroyed(this),
      filter((e) => e instanceof NavigationEnd)
    )
    .subscribe(() => {
      if (this.sidenav.mode === 'over') {
        this.sidenav.close();
      }
    });
  }
  ngOnInit(): void {

  }

  public isAuthenticated(): boolean {
    return false;
  }

  public login() {

  }

  public logout() {
  }

  public help() {

  }

  public settings() {

  }

}

