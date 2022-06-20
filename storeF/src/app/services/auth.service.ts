import { Injectable } from '@angular/core';
import { Auth, authState, ConfirmationResult, createUserWithEmailAndPassword, getAuth, RecaptchaVerifier, sendPasswordResetEmail, signInWithPhoneNumber, updateProfile, UserCredential } from '@angular/fire/auth'
import { signInWithEmailAndPassword } from '@firebase/auth';
import { from, Observable, switchMap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})

/**
 * This service contains all releated to user login/signup/logout
 */
export class AuthService {
  requestChangePassword(email: string) {
    return (from(sendPasswordResetEmail(this.auth, email)))
  }

  currentUser$ = authState(this.auth);

  confirmationResultOtp!: ConfirmationResult;

  constructor(private auth: Auth) { }


  login(username:string,password:string){
    return from(signInWithEmailAndPassword(this.auth, username, password)); 
  }

  logout(){
    return from(this.auth.signOut());
  }

  signUp(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  generateCaptcha(): RecaptchaVerifier {
    return new RecaptchaVerifier('sign-in-button', {
      'size': 'invisible'
      }
    , getAuth());
  }
  loginPhone(phone: string, recaptcha: RecaptchaVerifier): Observable<ConfirmationResult> {
    return from(signInWithPhoneNumber(this.auth, phone, recaptcha))
  }
  verifyOtp(otp: string): Observable<any>{
    return from(this.confirmationResultOtp.confirm(otp))
  }

  
}
