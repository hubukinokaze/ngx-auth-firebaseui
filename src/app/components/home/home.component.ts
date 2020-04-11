import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  title = 'Heavenly Parent Reflections';

  constructor(private db: AngularFirestore,
    public router: Router) { }

  ngOnInit(): void {
  }

  printUser(event) {
    console.log('onSuccess event ->', event);
    this.goToPage('landing');
  }

  public goToPage(link) {
    this.router.navigate([link]);
  }
}
