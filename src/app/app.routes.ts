import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { EventsComponent } from './pages/events/events.component';
import { EventFormComponent } from './pages/events/event-form/event-form.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
      { path: 'login', component: LoginComponent },
      {
     path:'',
     component:MainLayoutComponent,
     canActivate:[authGuard],
     children:[
        {path:'home', component:HomeComponent},
        {path:'events',component:EventsComponent},
        {path:'event/new',component:EventFormComponent},
        {path:'event/edit/:id',component:EventFormComponent},
        {path :'', redirectTo:'home', pathMatch:'full'},
     ]
    },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }

];
