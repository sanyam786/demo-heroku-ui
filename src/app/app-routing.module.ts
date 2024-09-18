import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewComponent } from './view/view.component';
import { FamilyComponent } from './family/family.component';
import { CreateUpdateMemberComponent } from './create-update-member/create-update-member.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},   
  //{ path: '', redirectTo: 'tutorials', pathMatch: 'full' },
  { path: 'tutorials', component: TutorialsListComponent, canActivate: [AuthGuard] },
  { path: 'tutorials/:id', component: TutorialDetailsComponent, canActivate: [AuthGuard] },
  { path: 'add', component: AddTutorialComponent, canActivate: [AuthGuard] },
  { path: 'view/:id', component: ViewComponent, canActivate: [AuthGuard] },
  { path: 'family/:id', component: FamilyComponent, canActivate: [AuthGuard] },
  { path: 'create-update-member', component: CreateUpdateMemberComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
  //{ path: 'admin-dashboard', component: AdminDashboardComponent },
  //{ path: 'user-dashboard', component: UserDashboardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
