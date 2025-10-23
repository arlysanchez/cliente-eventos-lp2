import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { EventsComponent } from './pages/events/events.component';

export const routes: Routes = [
    {
     path:'',
     component:MainLayoutComponent,
     children:[
        {path:'home', component:HomeComponent},
        {path:'events',component:EventsComponent},
        {path :'', redirectTo:'home', pathMatch:'full'},
     ]
    }





];
