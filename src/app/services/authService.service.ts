import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private loginUrl = 'http://localhost:8082/auth/login';
  private loginUrl = 'https://demo-heroku-315200bec293.herokuapp.com/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, credentials);
  }

  isAuthenticated(): boolean {
    // Check if the token is present in localStorage
    return !!localStorage.getItem('token');
  }

  logout() {
    // Remove token on logout
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInRole');
    localStorage.removeItem('loggedInMemberId');
  }
}