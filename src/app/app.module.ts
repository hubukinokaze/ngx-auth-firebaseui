import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {Angulartics2Module} from 'angulartics2';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgxAuthFirebaseUIModule} from 'ngx-auth-firebaseui';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {FormsModule} from '@angular/forms';
import {MarkdownModule} from 'ngx-markdown';
import {FlipComponent, FlipSection} from './flip/flip.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';

export const firebaseKey = {
    apiKey: "AIzaSyC4CqiByhbG-3r2RGRnJ_dzWNighzZi6j4",
    authDomain: "reflection-table.firebaseapp.com",
    databaseURL: "https://reflection-table.firebaseio.com",
    projectId: "reflection-table",
    storageBucket: "reflection-table.appspot.com",
    messagingSenderId: "315134424511",
    appId: "1:315134424511:web:56fa720d9d9a5382ad1d0a",
    measurementId: "G-ZPT178NW60"
};

export function firebaseAppNameFactory() {
  return `reflection-table`;
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    FlipSection,
    FlipComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    Angulartics2Module.forRoot(),
    AngularFireModule.initializeApp(firebaseKey),
    AngularFireDatabaseModule,
    NgxAuthFirebaseUIModule.forRoot(firebaseKey, firebaseAppNameFactory,
      {
        enableFirestoreSync: true,
        toastMessageOnAuthSuccess: true,
        toastMessageOnAuthError: true,
        authGuardFallbackURL: 'examples/logged-out',
        authGuardLoggedInURL: 'examples/logged-in',
      }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    MarkdownModule.forRoot({loader: HttpClient}),
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatToolbarModule,
    NgxAuthFirebaseUIModule.forRoot(firebaseKey)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
