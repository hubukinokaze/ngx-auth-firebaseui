import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User as LoginUser } from 'firebase';
import { Observable } from 'rxjs';
import { User } from '../classes/user/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: User;
  private loginUser: LoginUser;
  private storedUsers: any = {};
  private user$: Observable<LoginUser | null>;
  private userEvent$: EventEmitter<any>;
  private loginUserEvent$: EventEmitter<any>;

  constructor(private auth: AngularFireAuth,
    public router: Router,
    private db: AngularFirestore) {
    this.userEvent$ = new EventEmitter();
    this.loginUserEvent$ = new EventEmitter();
    this.user$ = this.auth.user;

    this.user$.subscribe((loginUser: LoginUser) => {
      this.loginUser = loginUser;
      this.loginUserEvent$.emit(this.loginUser);
    });

    this.user$.subscribe((data) => {
      if (data) {
        this.db.doc<User>('/users/' + data.uid).valueChanges().pipe(
          map(snapshot => {
            if (snapshot) {
              if (!snapshot) {
                throw "user is undefined";
              } else if (this.user) {
                // throw "user exists";
              }

              const user = snapshot;

              return new User(user.uid, user.displayName, user.email, user.chapters, user.primaryRole, user.secondaryRole);
            }
            
          })
        ).subscribe((userData) => {
          if (userData) {
            this.user = userData;
            this.userEvent$.emit(this.user);
          }
        }, (error) => {
          console.log(error)
        });
      } else {
        this.router.navigate(['/landing']);
      }
      
    });


  }

  public getUserEvent() {
    return this.userEvent$;
  }

  public getLoginUserEvent() {
    return this.loginUserEvent$;
  }

  public getUser(): User {
    return this.user;
  }

  public setUser(user: User | null) {
    if (user) {
      this.user.displayName = user.displayName;
      this.user.primaryRole = user.primaryRole;
      this.user.secondaryRole = user.secondaryRole;
      this.user.chapters = user.chapters;
    } else {
      this.loginUser = null;
      this.user = null;
      this.auth.auth.signOut();
    }
    
    this.userEvent$.next(this.user);
  }

  public setLoginUser(user: LoginUser | null) {
    if (user) {
      this.loginUser.displayName = user.displayName;
      this.loginUser.email = user.email;
      this.loginUser.photoURL = user.photoURL;
    } else {
      this.loginUser = null;
      this.user = null;
      this.auth.auth.signOut();
    }
    
    this.loginUserEvent$.next(this.loginUser);
  }

  public getLoginUser(): LoginUser {
    return this.loginUser;
  }

  public getStoredUsers() {
    return this.storedUsers;
  }

  public addStoredUsers(id: string, data: any) {
    this.storedUsers[id] = data;
  }
}
