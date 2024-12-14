import { Component, Injectable, HostListener, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import { AuthService } from './services/authService.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Sadhumargi Jain Sangh';
  loggedInMemberId = 0;
  images = [
    'assets/2S7A0670.JPG',
    'assets/2S7A0663.JPG',
    'assets/image.jpg',
    'assets/image2.jpg'
  ];

  currentIndex = 0;
  intervalId: any;


  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  constructor(private router: Router,
    private authService: AuthService,
    private familyMemberService: FamilyMemberService
  ) {
    this.setViewportHeight();
    this.addEventListeners();
  }

  ngOnInit(): void {
    // Start automatic image sliding
    this.startAutoSlide();
    this.loggedInMemberId = this.familyMemberService.getLoggedInMemberId();
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

  viewMyProfile() {
      if(this.loggedInMemberId !== 0){
        // Navigate to the view component and pass the id
      this.router.navigate(['/view', this.loggedInMemberId]);
      }
  }

  allSearch(){
    this.router.navigate(['/allsearch']);
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    // Clear interval when component is destroyed
    clearInterval(this.intervalId);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000); // Change slide every 5 seconds
  }
}
