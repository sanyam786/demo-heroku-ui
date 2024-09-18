import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService.service';
import { FamilyMemberService } from '../services/familyMember.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loggedInRole: string = '';
  loggedInMemberId: number = 0;

  constructor(private authService: AuthService, 
    private router: Router,
    private familyMemberService: FamilyMemberService) {}
  loginData = { username: '', password: '' };
  onLogin() {
    this.authService.login(this.loginData).subscribe(
      response => {
        this.loggedInMemberId = response.memberId;
        this.loggedInRole = response.role;
        this.familyMemberService.setLoggedInMemberId(this.loggedInMemberId);
        this.familyMemberService.setLoggedInRole(this.loggedInRole);
        // Handle login success, e.g., store the token and redirect
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']); // Redirect to dashboard or protected route
      },
      error => {
        // Handle login error
        this.errorMessage = 'Invalid Credentials!'
        console.error('Login failed:', error);
      }
    );
  }
}
