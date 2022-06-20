import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { CartComponent } from './components/cart/cart.component';
import { ContactComponent } from './components/contact/contact.component';
import { HelpComponent } from './components/help/help.component';
import { HomeComponent } from './components/home/home.component';
import { LoginOtpComponent } from './components/login-otp/login-otp.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard'
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminAuthGuardService } from './services/admin-auth-guard.service';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ProductComponent } from './components/product/product.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo(['home']);
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: ProductComponent},
  { path: 'products', component: HomeComponent },
 { path: 'products/:id', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, ...canActivate(redirectToLogin) },
  { path: 'about', component: AboutComponent },
  { path: 'help', component: HelpComponent },
  { path: 'login', component: LoginComponent,  ...canActivate(redirectToHome)},
  {path: 'login-otp', component: LoginOtpComponent, ...canActivate(redirectToHome)},
  { path: 'signup', component: SignUpComponent, ...canActivate(redirectToHome) },
  { path: 'adminUsers', component: AdminUsersComponent,  canActivate: [AdminAuthGuardService]},
  {path: 'adminProducts', component: AdminProductsComponent, canActivate: [AdminAuthGuardService]},
  {path: 'editProduct', component:EditProductComponent, canActivate: [AdminAuthGuardService]},
  { path: 'contact', component: ContactComponent },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AdminAuthGuardService]},
  { path: 'cart', component: CartComponent, ...canActivate(redirectToLogin) },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
