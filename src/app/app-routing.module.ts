import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent }     from './register/register.component';
import { MainComponent }     from './main/main.component';
import { ProfileComponent }     from './profile/profile.component';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'main', component: MainComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
