import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './angular-material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoginOtpComponent } from './components/login-otp/login-otp.component';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HelpComponent } from './components/help/help.component';
import { ProductComponent } from './components/product/product.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { HotToastModule } from '@ngneat/hot-toast';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgOtpInputModule } from 'ng-otp-input';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { JoinPipe } from './pipes/joinPipe';
import { FlexLayoutModule } from "@angular/flex-layout";
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { NgxChartsModule }from '@swimlane/ngx-charts';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';
import { CargarScriptsService } from './cargar-scripts.service';

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    LoginComponent,
    SignUpComponent,
    LoginOtpComponent,
    HomeComponent,
    CartComponent,
    AboutComponent,
    ContactComponent,
    ProfileComponent,
    HelpComponent,
    ProductComponent,
    NotFoundComponent,
    AdminUsersComponent,
    AdminProductsComponent,
    EditProductComponent,
    JoinPipe,
    AnalyticsComponent
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserModule,
    AppRoutingModule,
    AngularMaterialModule,
    BrowserAnimationsModule,
    HotToastModule.forRoot(),
    FlexLayoutModule,
    NgOtpInputModule,
    QRCodeModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    NgxChartsModule,
    FontAwesomeModule
  ],
  providers: [CargarScriptsService],
  bootstrap: [AppComponent],
  entryComponents: [EditProductComponent]
})
export class AppModule { }
