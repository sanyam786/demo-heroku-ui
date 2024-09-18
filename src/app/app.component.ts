import { Component, Injectable, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/authService.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sadhumargi Sangh Directory';
 
  constructor(private router: Router, private authService: AuthService) {
    this.setViewportHeight();
    this.addEventListeners();
  }

  // Function to dynamically calculate and set the viewport height
  setViewportHeight(): void {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Function to listen for resize and load events
  addEventListeners(): void {
    window.addEventListener('resize', () => this.setViewportHeight());
    window.addEventListener('load', () => this.setViewportHeight());
  }

  logout(): void {
    this.authService.logout(); // Call the AuthService to perform logout
    this.router.navigate(['/login']); // Redirect to the login page
  }

  isLoggedOut() {
    if(this.authService.isAuthenticated()){
      return true;
    }
    return false;
  }
}
