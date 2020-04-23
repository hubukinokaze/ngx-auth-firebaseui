import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing.component';
import {ManageUsersComponent} from './components/manage-users/manage-users.component';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {LoggedInGuard} from 'ngx-auth-firebaseui';

const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent,
    
    data: {title: 'Heavenly Parent Reflections'}
  }, {
    path: 'home',
    component: HomeComponent,
    canActivate: [LoggedInGuard],
    data: {title: 'Heavenly Parent Reflections'}
  }, {
    path: 'users',
    component: ManageUsersComponent,
    canActivate: [LoggedInGuard],
    data: {title: 'Heavenly Parent Reflections - Users'}
  }, {
    path: '',
    redirectTo: '/landing',
    pathMatch: 'full'
  }, {
    path: '**',
    component: PageNotFoundComponent,
    data: {title: 'Page Not Found'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
