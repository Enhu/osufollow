import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent }     from './register/register.component';
import { MainComponent }     from './main/main.component';
import { ProfileComponent }     from './profile/profile.component';
import { LoginComponent} from "./login/login.component";
import { StatsComponent } from './stats/stats.component';
import { AuthGuard  } from './_helpers/auth.guard';
import { TestComponent } from './test/test.component';
const routes: Routes = [
  { path: 'register', component: RegisterComponent},
  { path: 'main', component: MainComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'test', component: TestComponent },
  { path: 'stats', component: StatsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
