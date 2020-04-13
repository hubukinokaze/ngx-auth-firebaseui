import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { map } from "rxjs/operators";
import { User } from '../../classes/user/user.model';
import { Reflection } from '../../classes/reflection/reflection.model';
import { AddDialog } from '../../dialogs/add/add.dialog';
import { DeleteDialog } from '../../dialogs/delete/delete.dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  snackbarSubscription: Subscription;

  public title = 'Heavenly Parent Reflections';
  public user: User;

  public displayedColumns: string[] = ['chapter', 'name', 'source', 'episode', 'content', 'actions'];
  public dataSource: MatTableDataSource<Reflection>;
  private tempReflectionArray: Array<Reflection>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private db: AngularFirestore,
    public router: Router,
    public dialog: MatDialog,
    public snackbar: MatSnackBar) {
    // Create 100 users

  }

  ngOnInit(): void {
    this.getReflections()
  }

  ngOnDestroy(): void {
    if (this.snackbarSubscription) {
      this.snackbarSubscription.unsubscribe();
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
    this.db.collection<Reflection>('/reflections').get().pipe(
      map(snapshot => {
        let items = [];
        snapshot.docs.map(a => {
          const data = a.data();
          const id = a.id;
          items.push(new Reflection(id, data.carpChapter, data.content, data.episode, data.source, data.userId.id, data.userId.path));
        })
        return items
      })
    ).subscribe((data) => {
      for (let reflection of data) {
        this.getUser(reflection.userURL).subscribe((userData) => reflection.displayName = userData.displayName);
      }

      // data.sort((a, b) => a.episode < b.episode ? -1 : a.episode > b.episode ? 1 : 0);

      let sortBy = [{
        prop: 'source',
        direction: 1
      }, {
        prop: 'episode',
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

      this.tempReflectionArray = data;

      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private getUser(userURL: string) {
    return this.db.doc<User>(userURL).get().pipe(
      map(snapshot => {
        const data = snapshot.data();
        const id = snapshot.id;
        return new User(id, data.displayName, data.email, data.chapters, data.primaryRole, data.secondaryRole);
      })
    );
  }

  printUser(event) {
    console.log('onSuccess event ->', event);
    this.goToPage('landing');
  }

  public goToPage(link) {
    this.router.navigate([link]);
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialog, {
      data: { displayName: 'Jun Kawa', userId: this.db.doc('/users/DPCt524ykyQsaWz5HTOPu9VO6No1').ref }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(2, result);

        const newReflection = this.db.collection('reflections').add(result).then(() => {
          this.getReflections();
          this.snackbar.open('Added reflection!', 'OK', { duration: 5000 });
        }).catch ( (error) => {
          this.snackbar.open('Something went wrong...', 'OK', { duration: 5000 });
        });

      }
    });
  }

  startEdit(i: number, id: number, title: string, state: string, url: string, created_at: string, updated_at: string) {
    // this.id = id;
    // // index row is used just for debugging proposes and can be removed
    // this.index = i;
    // console.log(this.index);
    // const dialogRef = this.dialog.open(EditDialogComponent, {
    //   data: {id: id, title: title, state: state, url: url, created_at: created_at, updated_at: updated_at}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result === 1) {
    //     // When using an edit things are little different, firstly we find record inside DataService by id
    //     const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
    //     // Then you update that record using data from dialogData (values you enetered)
    //     this.exampleDatabase.dataChange.value[foundIndex] = this.dataService.getDialogData();
    //     // And lastly refresh table
    //     this.refreshTable();
    //   }
    // });
  }

  deleteItem(i, reflection: Reflection) {
    console.log(i, reflection);

    const dialogRef = this.dialog.open(DeleteDialog, {
      data: reflection
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.db.collection('reflections').doc(reflection.id).delete().then(() => {
          this.tempReflectionArray.splice(i, 1);

          this.dataSource = new MatTableDataSource(this.tempReflectionArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
  
          this.snackbar.open('Deleted reflection!', 'OK', { duration: 5000 });
        }).catch ( (error) => {
          console.log(error);
          this.snackbar.open('Something went wrong...', 'OK', { duration: 5000 });
        });
      }
    });
  }
}
