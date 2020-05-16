import {BrowserModule} from '@angular/platform-browser';
import {NgModule, LOCALE_ID} from '@angular/core';

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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MarkdownModule} from 'ngx-markdown';
import {FlipComponent, FlipSection} from './flip/flip.component';
import {HomeComponent} from './components/home/home.component';
import {LandingComponent} from './components/landing/landing.component';
import {ManageUsersComponent} from './components/manage-users/manage-users.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {LoginComponent} from './components/login/login.component';
import {AddDialog} from './dialogs/add/add.dialog';
import {DeleteDialog} from './dialogs/delete/delete.dialog';
import {EditDialog} from './dialogs/edit/edit.dialog';
import {ProfileDialog} from './dialogs/profile/profile.dialog';
import {ConfirmationDialog} from './dialogs/confirmation/confirmation.dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSortModule} from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import { AvatarComponent } from './components/avatar/avatar.component';

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
  exports: [
    LoginComponent
  ],
  declarations: [
    AppComponent,
    FlipSection,
    FlipComponent,
    HomeComponent,
    LandingComponent,
    AddDialog,
    DeleteDialog,
    EditDialog,
    ProfileDialog,
    ConfirmationDialog,
    AvatarComponent,
    ManageUsersComponent,
    PageNotFoundComponent,
    LoginComponent
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
        authGuardFallbackURL: 'landing',
        authGuardLoggedInURL: 'home',
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
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDividerModule,
    NgxAuthFirebaseUIModule.forRoot(firebaseKey)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
