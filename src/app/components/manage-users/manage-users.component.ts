import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/classes/user/user.model';
import { Reflection } from 'src/app/classes/reflection/reflection.model';
import { ProfileDialog } from 'src/app/dialogs/profile/profile.dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ConfirmationDialog } from 'src/app/dialogs/confirmation/confirmation.dialog';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, OnDestroy {

  snackbarSubscription: Subscription;
  userSubscription: Subscription;

  public title = 'Heavenly Parent Reflections';
  public user: User;

  public displayedColumns: string[] = ['displayName', 'primaryRole', 'secondaryRole', 'chapters', 'actions'];
  public dataSource: MatTableDataSource<User>;
  public tempUserArray: Array<User>;
  public isLoading: boolean = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private db: AngularFirestore,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.getUser()) {
      this.user = this.userService.getUser();
      this.getUsers();
    } else {
      this.userSubscription = this.userService.getUserEvent().subscribe((userData: User) => {
        this.user = userData;
        this.getUsers();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private getUsers() {
    if (this.whatRank(this.user.primaryRole) == 0) {
      this.goToPage('home');
    }
    let chapterList = [""];
    if (this.user?.chapters && this.user.chapters.length > 0) {
      chapterList = this.user.chapters;
    }
    let link = this.whatRank(this.user.primaryRole) > 3 ? this.db.collection("users").ref.orderBy("displayName", "desc") :
      this.db.collection("users").ref.orderBy("displayName", "desc").where("chapters", 'array-contains-any', chapterList);
    link.get().then((snapshot) => {
      let items = [];
      snapshot.docs.map(a => {
        const data = a.data();
        const id = a.id;
        items.push(new User(data.uid, data.displayName, data.email, data.chapters, data.primaryRole, data.secondaryRole));

      })
      return items;

    }).then(async (data) => {
      let sortBy = [{
        prop: 'displayName',
        direction: 1
      }, {
        prop: 'primaryRole',
        direction: 1
      }, {
        prop: 'secondaryRole',
        direction: 1
      }];

      data.sort(function (a, b) {
        let i = 0, result = 0;
        while (i < sortBy.length && result === 0) {
          result = sortBy[i].direction * (a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
          i++;
        }
        return result;
      });

      this.tempUserArray = data;
      this.isLoading = false;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public startEdit(i: number, user: User) {
    const dialogRef = this.dialog.open(ProfileDialog, {
      data: {
        chapters: this.user.chapters,
        ...user,
        otherUser: this.user,
        userId: this.db.doc(`/users/${user.id}`).ref,
        isOtherUser: true
      },
      panelClass: ['full-width-dialog', 'profile-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let tempUser = {
          chapters: result.chapters,
          primaryRole: result.primaryRole,
          modified: new Date(),
          secondaryRole: result.secondaryRole
        };

        user.chapters = result.chapters;
        user.primaryRole = result.primaryRole;
        user.modified = new Date();

        if (result.secondaryRole) {
          user.secondaryRole = result.secondaryRole;
        } else {
          delete tempUser.secondaryRole;
        }

        this.db.collection('users').doc(result.id).update(tempUser).then((newResult) => {
          this.snackbar.open(`Updated ${user.displayName}`, 'OK', { duration: 5000 });
        }).catch((error) => {
          this.snackbar.open('Something went wrong...', 'OK', { duration: 5000 });
        });
      }
    });
  }

  public deleteUser(i: number, user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        ...user,
        title: 'Delete',
        contentText: `Are you sure you want to delete ${user.displayName}?`,
        firstBtnTxt: 'Delete',
        firstBtnColor: 'warn',
        secondBtnTxt: 'Cancel',
        secondBtnColor: null
      },
      panelClass: ['confirmation-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tempUserArray.splice(i, 1);
        this.refreshTable(this.tempUserArray);
    
        this.db.collection('users').doc(user.id).delete().then(() => {
          this.snackbar.open(`Deleted ${user.displayName}`, 'OK', { duration: 5000 });
        }).catch((error) => {
          this.snackbar.open('Something went wrong...', 'OK', { duration: 5000 });
        });
      }
    });


  }

  public reformatChapters(chapters: Array<string>, type: string): string {
    if (chapters && chapters.length > 0) {
      chapters = chapters.sort();
      if (type === 'display') {
        if (chapters && chapters.length > 3) {
          return `${chapters[0]}, ${chapters[1]}, ${chapters[2]}, +${chapters.length - 3}`;
        } else if (chapters && chapters.length > 0 && chapters.length < 4) {
          return chapters.join(', ');
        }
  
        return 'N/A';
      } else {
        if (chapters && chapters.length > 3) {
          const extra: Array<string> = chapters.slice(3);
          return extra.join(', ');
        }
      }
    } else {
      return 'N/A';
    }
    

  }

  private whatRank(privilege: string): number {
    if (privilege == 'Admin') {
      return 5;
    } else if (privilege == 'Boss') {
      return 4;
    } else if (privilege == 'Regional Leader') {
      return 3;
    } else if (privilege == 'President') {
      return 2;
    }
    return 0;
  }

  public actionPriviledge(row: User): boolean {
    if (this.user.primaryRole == 'Member' || !this.user.primaryRole) {
      return false;
    }

    const rowUserRank = this.whatRank(row.primaryRole);
    const userRank = this.whatRank(this.user.primaryRole);

    return userRank > rowUserRank;
  }

  private refreshTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }

  public toggleRow(row: Reflection, x: Element["classList"]) {
    if (!!x && x.contains('small-screen-on')) {
      return !row.expanded;
    }
    return row.expanded;
  }

  public signOut(event) {
    this.userService.setUser(null);
  }

  public printUser(event) {
    console.log('onSuccess event ->', event);
    this.goToPage('landing');
  }

  public goToPage(link) {
    this.router.navigate([link]);
  }

}
