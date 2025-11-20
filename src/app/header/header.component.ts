import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { IUser } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent{

    // Creamos un observable para los datos del usuario
  user$: Observable<IUser | null>;

   // 2. Inyecta el AuthService en el constructor
  constructor(private authService: AuthService) {
     this.user$ = this.authService.currentUser$;
  }
  
  // 3. Crea el método que será llamado desde el botón en el HTML
  logout(): void {
    this.authService.logout();
  }

}
