import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-tab',
  templateUrl: './account-tab.page.html',
  styleUrls: ['./account-tab.page.scss'],
})
export class AccountTabPage implements OnInit {
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']); // Redirige a la página de login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
