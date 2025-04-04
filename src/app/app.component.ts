import { Component, Injectable, HostListener, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import { AuthService } from './services/authService.service';
import { Member } from './models/Member.model';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  
  loggedInMemberId = 0;
  member?: Member;
  

  constructor(private router: Router,
    private authService: AuthService,
    private familyMemberService: FamilyMemberService
  ) {
    this.setViewportHeight();
    this.addEventListeners();
  }

  ngOnInit(): void {
    this.loggedInMemberId = this.familyMemberService.getLoggedInMemberId();
    this.loadData(this.loggedInMemberId);
  }

  loadData(id: number): void {
    //this.isLoading = true;  // Show progress bar
    this.familyMemberService.getMemberById(id).subscribe({
      next: (data) => {
        this.member = data;
        //this.isLoading = false;
        //console.log(data);
      },
      error: (e) => {
        console.error(e);
        //this.isLoading = false;  // Hide progress bar on error
      }
    });
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
    this.router.navigate(['/home']); // Redirect to the login page
  }

  login(): void {
    this.router.navigate(['/login']); // Redirect to the login page
  }

  isLoggedIn() {
    if(this.authService.isAuthenticated()){
      return true;
    }
    return false;
  }

  viewMyProfile() {
    this.loggedInMemberId = this.familyMemberService.getLoggedInMemberId()
      if(this.loggedInMemberId !== 0){
        // Navigate to the view component and pass the id
      this.router.navigate(['/view', this.loggedInMemberId]);
      }
  }

  viewMyId() {
    this.loggedInMemberId = this.familyMemberService.getLoggedInMemberId()
      if(this.loggedInMemberId !== 0){
        // Navigate to the view component and pass the id
      this.router.navigate(['/id-card', this.loggedInMemberId]);
      }
  }

  allSearch(){
    this.router.navigate(['/allsearch']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  viewSJSInfo(){
    this.router.navigate(['/sjsinfo']);
  }

  viewSMMInfo(){
    this.router.navigate(['/smminfo']);
  }

  viewSYSInfo(){
    this.router.navigate(['/sysinfo']);
  }

  viewSBMInfo(){
    this.router.navigate(['/sbminfo']);
  }
}
