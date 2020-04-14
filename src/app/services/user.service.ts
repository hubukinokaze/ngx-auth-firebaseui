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

    this.auth.user.subscribe((data) => {
      if (data) {
        this.db.doc<User>('/users/' + data.uid).get().pipe(
          map(snapshot => {
            if (snapshot) {
              const data = snapshot.data();
              const id = snapshot.id;
              return new User(id, data.displayName, data.email, data.chapters, data.primaryRole, data.secondaryRole);
            }
            
          })
        ).subscribe((userData) => {
          if (userData) {
            this.user = userData;
            this.userEvent$.emit(this.user);
          }
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
      this.user = null;
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
    }
    
    this.loginUserEvent$.next(this.loginUser);
  }

  public getLoginUser(): LoginUser {
    return this.loginUser;
  }
}
