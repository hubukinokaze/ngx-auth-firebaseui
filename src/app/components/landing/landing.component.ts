import { Component, OnDestroy } from '@angular/core';
import { AuthProvider, Theme } from 'ngx-auth-firebaseui';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatTabChangeEvent } from '@angular/material/tabs';
import * as firebase from 'firebase/app';
import { TranslateService } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnDestroy {

  title = 'Heavenly Parent Reflections';

  viewSourceOfNgxAuthFirebaseuiComponent: boolean;
  viewSourceOfNgxAuthFirebaseuiLoginComponent: boolean;
  viewSourceOfNgxAuthFirebaseuiRegisterComponent: boolean;
  viewSourceOfTheUserComponent: boolean;
  viewSourceOfTheProvidersComponentRow: boolean;
  viewSourceOfTheProvidersComponentColumn: boolean;
  viewSourceOfTheProvidersComponentThemes: boolean;

  snackbarSubscription: Subscription;

  error: boolean;
  public index: number;
  public isLoading: boolean;

  providers = AuthProvider;
  themes = Theme;


  constructor(private auth: AngularFireAuth,
    private db: AngularFirestore,
    public router: Router,
    private snackbar: MatSnackBar,
    public translate: TranslateService) {
    if (window.sessionStorage.getItem('pending')) {
      window.sessionStorage.removeItem('pending');
      this.isLoading = true;
      firebase.auth().getRedirectResult().then(result => {
        console.log(result);
        this.isLoading = false;

        if (result && result.additionalUserInfo.isNewUser) {
          this.db
            .doc('users/' + result.user.uid)
            .set({
              displayName: result.user.displayName,
              email: result.user.email,
              photoURL: result.user.photoURL,
              providerId: 'google.com',
              primaryRole: 'Member',
              uid: result.user.uid
           }).finally(() => {
             this.goToPage('home');
           });
        } else if (result && !result.additionalUserInfo.isNewUser) {
          this.goToPage('home');
        }
      });
    }
  }

  get color(): string {
    return this.error ? 'warn' : 'primary';
  }

  printUser(event) {
    // console.log('onSuccess event ->', event);
    this.error = false;
    this.index = 2;
    this.goToPage('home');
  }

  printError(event) {
    // console.error('onError event --> ', event);
    this.error = true;

    this.snackbar.open(event.message, 'OK', { duration: 5000 });
    // this.auth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()).then( (cred) => {
    //   console.log(11, cred);
    // }).catch((error) => console.log(error));
    // this.snackbar.open(event.message, 'OK', {duration: 5000});
  }

  ngOnDestroy(): void {
    if (this.snackbarSubscription) {
      this.snackbarSubscription.unsubscribe();
    }
  }

  public setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  onTabChange(event: MatTabChangeEvent) {
    console.log('on tab change: ', event);
  }

  onSignOut() {
    console.log('Sign-out successful!');
  }

  onAccountDeleted() {
    console.log('Account Delete successful!');
  }

  createAccount() {
    console.log('create account has beeen requested');
  }

  public goToPage(link) {
    this.router.navigate([link]);
  }
}
