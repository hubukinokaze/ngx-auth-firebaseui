import { Directive, ChangeDetectorRef } from '@angular/core';
import { Host, Self, Optional } from '@angular/core';
import { AuthComponent, ICredentials } from 'ngx-auth-firebaseui';
import UserCredential = firebase.auth.UserCredential;
import * as firebase from 'firebase';

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export enum AuthProvider {
  ALL = 'all',
  ANONYMOUS = 'anonymous',
  EmailAndPassword = 'firebase',
  Google = 'google',
  Apple = 'Apple',
  Facebook = 'facebook',
  Twitter = 'twitter',
  Github = 'github',
  Microsoft = 'microsoft',
  Yahoo = 'yahoo',
  PhoneNumber = 'phoneNumber'
}

@Directive({
  selector: '[app-login]',
})
export class LoginComponent {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    @Host() @Self() @Optional() public hostSel: AuthComponent) {
    // Now you can access specific instance members of host directive
    let app = (<any>hostSel)._app;
    // also you can override specific methods from original host directive so that hostSel specific instance uses your method rather than their original methods.
    hostSel.authProcess.signInWith = ((provider: AuthProvider, credentials?: ICredentials) => {
      return new Promise( async () => {
        try {
          let signInResult: UserCredential | any;

          switch (provider) {
            case AuthProvider.ANONYMOUS:
              signInResult = await hostSel.authProcess.afa.auth.signInAnonymously() as UserCredential;
              break;

            case AuthProvider.EmailAndPassword:
              signInResult = await hostSel.authProcess.afa.auth.signInWithEmailAndPassword(credentials.email, credentials.password) as UserCredential;
              break;

            case AuthProvider.Google:
              signInResult = await hostSel.authProcess.afa.auth.signInWithRedirect(googleAuthProvider).then((cred) => {
                return cred
              }) as UserCredential;
              break;

            default:
              throw new Error(`${AuthProvider[provider]} is not available as auth provider`);
          }
          await hostSel.authProcess.handleSuccess(signInResult);
        } catch (err) {
          hostSel.authProcess.handleError(err);
        }
      });
    });

  }
}