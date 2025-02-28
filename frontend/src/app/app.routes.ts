import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { ItemFormComponent } from '../components/item-form/item-form.component';
import { ItemDetailComponent } from '../components/item-detail/item-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: AuthComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'items/new', component: ItemFormComponent },
  { path: 'items/edit/:id', component: ItemFormComponent },
  { path: 'items/:id', component: ItemDetailComponent },
  { path: '**', redirectTo: 'home' },
];
