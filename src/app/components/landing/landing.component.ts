import {Component, OnDestroy} from '@angular/core';
import {AuthProvider, Theme} from 'ngx-auth-firebaseui';
import {Subscription} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';

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
  private _color: string;

  providers = AuthProvider;
  themes = Theme;


  constructor(public auth: AngularFireAuth,
              private db: AngularFirestore,
              public router: Router,
              public snackbar: MatSnackBar) {
  }

  get color(): string {
    return this.error ? 'warn' : 'primary';
  }

  printUser(event) {
    // console.log('onSuccess event ->', event);
    this.error = false;
    this.index = 2;
    // this.db
    //         .doc('users/' + event.uid)
    //         .update({ 
    //           firstName: '',
    //           lastName: '',
    //           darkMode: false,
    //           primaryRole: 'member',
    //           secondaryRole: ''
    //        });

    this.goToPage('home');
  }

  printError(event) {
    // console.error('onError event --> ', event);
    this.error = true;

    this.snackbar.open(event.message, 'OK', {duration: 5000});
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
