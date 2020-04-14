import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/classes/user/user.model';
import { User as LoginUser } from 'firebase';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ProfileDialog } from 'src/app/dialogs/profile/profile.dialog';
import * as cloneDeep from 'lodash/cloneDeep';

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
  public tempUser: User;

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
    this.tempUser = cloneDeep(this.user);
    this.tempUser.photoURL = this.loginUser?.photoURL;
    const dialogRef = this.dialog.open(ProfileDialog, {
      data: this.tempUser
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        delete result.photoURL;
        this.user = {...result};
        const temp = {
            displayName: this.user.displayName,
            primaryRole: this.user.primaryRole,
            secondaryRole: this.user.secondaryRole,
            chapters: this.user.chapters
        }

        if (!temp.secondaryRole) {
          delete temp.secondaryRole
        }

        this.db.collection('users').doc(result.id).update(temp).then(() => {
          this.userService.setUser(this.user);
          this.snackbar.open('Updated profile!', 'OK', { duration: 5000 });
        }).catch((error) => {
          this.snackbar.open('Something went wrong...', 'OK', { duration: 5000 });
        });
      }
    });
  }

  public signOut(): void {
    this.auth.auth.signOut().then( (event) => {
      this.router.navigate(['/landing']);
      this.userService.setUser(null);
    });
    
  }
}
