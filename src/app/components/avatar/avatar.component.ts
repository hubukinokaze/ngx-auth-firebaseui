import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { map } from "rxjs/operators";
import { User } from '../../classes/user/user.model';
import { User as LoginUser } from 'firebase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  snackbarSubscription: Subscription;
  userSubscription: Subscription;
  loginUserSubscription: Subscription;

  public user: User;
  public loginUser: LoginUser;

  constructor(private db: AngularFirestore,
    public auth: AngularFireAuth,
    public router: Router,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    public userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.getUser()) {
      this.user = this.userService.getUser();
    } else {
      this.userSubscription = this.userService.getUserEvent().subscribe((userData: User) => {
        this.user = userData;
      });
    }

    if (this.userService.getLoginUser()) {
      this.loginUser = this.userService.getLoginUser();
    } else {
      this.loginUserSubscription = this.userService.getLoginUserEvent().subscribe((userData: LoginUser) => {
        this.loginUser = userData;
      });
    }
  }

  ngOnDestroy(): void {
    if (this.snackbarSubscription) {
      this.snackbarSubscription.unsubscribe();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  public openProfile() {
    //nothing
  }

  public signOut(): void {
    this.auth.auth.signOut().then( (event) => {
      this.router.navigate(['/landing']);
      this.userService.setUser(null);
    });
    
  }
}
