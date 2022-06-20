import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { forkJoin, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login-otp',
  templateUrl: './login-otp.component.html',
  styleUrls: ['./login-otp.component.css']
})
export class LoginOtpComponent implements OnInit {

  constructor(private toast: HotToastService, private router: Router, private _formBuilder: FormBuilder, private authService: AuthService, private usersService: UsersService) { }
  otp!: string;
  reCaptchaVerifier!: any;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '50px',
      height: '50px',
    }
  };
  otpSent = false;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  phoneForm = new FormGroup({
    phone: new FormControl(undefined, [Validators.required])
  });

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.Mexico, CountryISO.UnitedStates];
  }

  ngOnInit(): void {
  }

  onOtpChange(otp: string) {
    this.otp = otp;
  }

  requestOtp() {
    const { phone } = this.phoneForm.value;
    console.log(phone.e164Number);
    this.reCaptchaVerifier = this.authService.generateCaptcha();
    console.log(this.reCaptchaVerifier)
    this.authService.loginPhone(phone.e164Number, this.reCaptchaVerifier).pipe(
      this.toast.observe(
        {
          success: 'otp code sent',
          loading: "generating Otp Code",
          error: "There was an error"
        }
      )
    ).subscribe(
      {
        next: (confirmationResult) => {
          this.authService.confirmationResultOtp = confirmationResult
          this.otpSent = true
        },
        error: (error) => {
          console.log(error)
          this.reCaptchaVerifier.clear()
        }
      }
    );
  }


  handleClick() {
    this.authService.verifyOtp(this.otp).pipe(
      switchMap(({ user: { uid } }) => {
        const profileUser = { uid };
        const addUserInDb = this.usersService.updateUser(profileUser);
        return forkJoin([addUserInDb])
      }),
      this.toast.observe(
        {
          success: 'Sesión Iniciada',
          loading: "Iniciando...",
          error: "Ocurrió un error"
        }
      )
    ).subscribe(() => {
      this.router.navigate(['/home']);
    }
    )
  }
}
