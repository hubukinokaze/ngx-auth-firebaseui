import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/classes/user/user.model';
import { Reflection } from 'src/app/classes/reflection/reflection.model';
import { AddDialog } from 'src/app/dialogs/add/add.dialog';
import { DeleteDialog } from 'src/app/dialogs/delete/delete.dialog';
import { EditDialog } from 'src/app/dialogs/edit/edit.dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*', display: 'table-row' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  snackbarSubscription: Subscription;
  userSubscription: Subscription;

  public title = 'Heavenly Parent Reflections';
  public user: User;

  public displayedColumns: string[] = ['chapter', 'displayName', 'source', 'episode', 'content', 'actions'];
  public dataSource: MatTableDataSource<Reflection>;
  public tempReflectionArray: Array<Reflection>;
  public isLoading: boolean = true;
  private loadLimit: number = 50;
  private pageData: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private db: AngularFirestore,
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private userService: UserService,
    private translate: TranslateService) {
    this.pageData = {
      length: 100,
      pageIndex: 0,
      pageSize: 20,
      previousPageIndex: -1
    }
  }

  ngOnInit(): void {
    if (this.userService.getUser()) {
      this.user = this.userService.getUser();
      if (this.user?.primaryRole == 'Admin' || this.user?.primaryRole == 'Boss') {
        this.loadLimit = 100;
      } else if (this.user?.primaryRole == 'Member') {
        this.loadLimit = 25;
      }

      this.getReflections();
    } else {
      this.userSubscription = this.userService.getUserEvent().subscribe((userData: User) => {
        this.user = userData;
        if (this.user?.primaryRole == 'Admin' || this.user?.primaryRole == 'Boss') {
          this.loadLimit = 100;
        } else if (this.user?.primaryRole == 'Member') {
          this.loadLimit = 25;
        }
        this.getReflections();
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

  private getReflections() {
    let chapterList = [""]
    if (this.user && this.user.chapters && this.user.chapters.length > 0) {
      chapterList = this.user.chapters;
    }
    this.db.collection("reflections").ref.orderBy("created", "desc").where("carpChapter", "in", chapterList).limit(this.loadLimit).get().then((snapshot) => {
      let items = [];
      snapshot.docs.map(a => {
        const data = a.data();
        const id = a.id;
        if (this.user.chapters && this.user.chapters.includes(data.carpChapter)) {
          items.push(new Reflection(id, data.carpChapter, data.content, data.episode, data.source, data.userId.id, data.userId.path, data.created, data.modified));
        } else if (!this.user.chapters) {
          // do something if no chapters
        }
      })
      return items;

    }).then(async (data) => {
      for (let reflection of data) {
        const userData: User = await this.getUser(reflection.userURL);
        if (userData.displayName) {
          reflection.displayName = userData.displayName
        }
      }

      this.tempReflectionArray = this.sorter(data);
      this.isLoading = false;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    // this.db.collection<Reflection>('/reflections').get().pipe(
    //   map(snapshot => {
    //     let items = [];
    //     snapshot.docs.map(a => {
    //       const data = a.data();
    //       const id = a.id;
    //       if (this.user.chapters && this.user.chapters.includes(data.carpChapter)) {
    //         items.push(new Reflection(id, data.carpChapter, data.content, data.episode, data.source, data.userId.id, data.userId.path, data.created, data.modified));
    //       } else if (!this.user.chapters) {
    //         // do something if no chapters
    //       }
    //     })
    //     return items
    //   })
    // ).subscribe((data) => {
    //   for (let reflection of data) {
    //     this.getUser(reflection.userURL).subscribe((userData) => reflection.displayName = userData.displayName);
    //   }

    //   let sortBy = [{
    //     prop: 'carpChapter',
    //     direction: 1
    //   }, {
    //     prop: 'source',
    //     direction: 1
    //   }, {
    //     prop: 'episode',
    //     direction: 1
    //   }];

    //   data.sort(function (a, b) {
    //     let i = 0, result = 0;
    //     while (i < sortBy.length && result === 0) {
    //       result = sortBy[i].direction * (a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
    //       i++;
    //     }
    //     return result;
    //   });

    //   this.tempReflectionArray = data;
    //   this.isLoading = false;

    //   this.dataSource = new MatTableDataSource(data);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // });
  }

  private sorter(data) {
    let sortBy = [{
      prop: 'carpChapter',
      direction: 1
    }, {
      prop: 'source',
      direction: 1
    }, {
      prop: 'episode',
      direction: -1
    }];

    return data.sort(function (a, b) {
      let i = 0, result = 0;
      while (i < sortBy.length && result === 0) {
        result = sortBy[i].direction * (a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
        i++;
      }
      return result;
    });
  }

  private async getUser(userURL: string) {
    const storedUsers = this.userService.getStoredUsers();

    if (storedUsers[userURL]) {
      return storedUsers[userURL];
    }

    return await this.db.doc<User>(userURL).ref.get().then((snapshot) => {
      const data = snapshot.data();
      this.userService.addStoredUsers(userURL, data);
      return new User(data.uid, data.displayName, data.email, data.chapters, data.primaryRole, data.secondaryRole);
    });

    // return this.db.doc<User>(userURL).get().pipe(
    //   map(snapshot => {
    //     const data = snapshot.data();
    //     const id = snapshot.id;
    //     this.userService.addStoredUsers(id, data);
    //     return new User(id, data.displayName, data.email, data.chapters, data.primaryRole, data.secondaryRole);
    //   })
    // );
  }

  public addNew() {
    const dialogRef = this.dialog.open(AddDialog, {
      data: {
        chapters: this.user.chapters,
        displayName: this.user.displayName,
        userId: this.db.doc('/users/' + this.user.id).ref
      },
      panelClass: ['full-width-dialog', 'add-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.created = new Date();
        this.db.collection('reflections').add(result).then((newResult) => {
          this.isLoading = true;
          result.id = newResult.id;
          result.userURL = `users/${this.user.id}`;

          this.tempReflectionArray.push(result);
          console.log(this.tempReflectionArray)
          this.refreshTable(this.tempReflectionArray);

          this.snackbar.open(this.translate.instant('console.success'), 'OK', { duration: 5000 });
        }).catch((error) => {
          this.snackbar.open(this.translate.instant('console.error'), 'OK', { duration: 5000 });
        });

      }
    });
  }

  public startEdit(i: number, reflection: Reflection) {
    const position: number = (this.pageData.pageSize * this.pageData.pageIndex) + i;
    const dialogRef = this.dialog.open(EditDialog, {
      data: {
        chapters: this.user.chapters,
        ...reflection,
        userId: this.db.doc(`/users/${this.user.id}`).ref
      },
      panelClass: ['full-width-dialog', 'edit-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.modified = new Date();
        this.db.collection('reflections').doc(result.id).update(result).then((newResult) => {
          this.isLoading = true;
          result.userURL = `users/${this.user.id}`;

          this.tempReflectionArray.splice(position, 1, result);
          this.refreshTable(this.tempReflectionArray);
          this.snackbar.open(this.translate.instant('console.success'), 'OK', { duration: 5000 });
        }).catch((error) => {
          this.snackbar.open(this.translate.instant('console.error'), 'OK', { duration: 5000 });
        });
      }
    });
  }

  public deleteItem(i: number, reflection: Reflection) {

    const position: number = (this.pageData.pageSize * this.pageData.pageIndex) + i;
    console.log(position, this.tempReflectionArray[position]);
    const dialogRef = this.dialog.open(DeleteDialog, {
      data: reflection,
      panelClass: ['full-width-dialog', 'delete-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.db.collection('reflections').doc(reflection.id).delete().then(() => {
          console.log(this.tempReflectionArray.splice(position, 1));

          this.refreshTable(this.tempReflectionArray);

          this.snackbar.open(this.translate.instant('console.success'), 'OK', { duration: 5000 });
        }).catch((error) => {
          console.log(error);
          this.snackbar.open(this.translate.instant('console.error'), 'OK', { duration: 5000 });
        });
      }
    });
  }

  public getPage(data) {
    this.pageData = data;
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

  public actionPriviledge(row: Reflection): boolean {
    if (this.user.primaryRole == 'Member' || !this.user.primaryRole) {
      return false;
    }

    const userRank = this.whatRank(this.user.primaryRole);

    return userRank > 0;
  }

  private refreshTable(data) {
    this.dataSource = new MatTableDataSource(this.sorter(data));
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
