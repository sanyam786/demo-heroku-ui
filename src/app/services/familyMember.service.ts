import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FamilyMember } from '../models/FamilyMember.model';
import { Member } from '../models/Member.model';

//const baseUrl = 'http://localhost:8082/api/tutorials';
const baseUrl = 'https://demo-heroku-315200bec293.herokuapp.com/api/family';
//const baseUrl = 'http://localhost:8082/api/family';
@Injectable({
  providedIn: 'root',
})
export class FamilyMemberService {

    //public loginResponse: any;
   public loggedInRole: string = '';
   public loggedInMemberId: number = 0;

  constructor(private http: HttpClient) {
    // When the service initializes, load the saved value from localStorage
    const role = localStorage.getItem('loggedInRole');
    if (role) {
      this.loggedInRole = role;  // Set the in-memory variable from localStorage
    }
    const memberId = localStorage.getItem('loggedInMemberId');
    if (memberId) {
      this.loggedInMemberId = parseInt(memberId);  // Set the in-memory variable from localStorage
    }
  }

  setLoggedInRole(value: any) {
    localStorage.setItem('loggedInRole', value);
    this.loggedInRole = value;
  }

  setLoggedInMemberId(value: any) {
    localStorage.setItem('loggedInMemberId', value);
    this.loggedInMemberId = value;
  }

  getLoggedInMemberId(): any {
    return this.loggedInMemberId;
  }

  getLoggedInRole(): any {
    return this.loggedInRole;
  }

  getAll(): Observable<FamilyMember[]> {
    return this.http.get<FamilyMember[]>(baseUrl + '/families');
  }

  getAllFamiliesForDefaultSearch(): Observable<Member[]> {
    return this.http.get<Member[]>(baseUrl + '/defaultfamilies');
  }

  searchMembers(params: any): Observable<Member[]> {
    let queryParams = new HttpParams();
    
    // Loop through the params object and set query parameters
    for (const key in params) {
      if (params[key]) {
        queryParams = queryParams.set(key, params[key]);
      }
    }
    return this.http.get<Member[]>(baseUrl + '/searchAllFilter', { params: queryParams });
  }

  get(id: any): Observable<FamilyMember> {
    return this.http.get<FamilyMember>(`${baseUrl}/families/${id}`);
  }

  getMemberById(id: any): Observable<Member> {
    return this.http.get<Member>(`${baseUrl}/member/${id}`);
  }

  getFamilyByMemberId(id: any): Observable<FamilyMember> {
    return this.http.get<FamilyMember>(`${baseUrl}/memberfamily/${id}`);
  }

  getFamilyIdByMemberId(id: any): Observable<any> {
    return this.http.get<any>(`${baseUrl}/memberfamilyId/${id}`);
  }

  create(data: any, id: any): Observable<any> {
    return this.http.post(`${baseUrl}/${id}/add-member`, data);
  }

  update(data: any, id: any): Observable<any> {
    return this.http.put(`${baseUrl}/updateMember/${id}`, data);
  }

  updateFamilyHead(id: any): Observable<any> {
    return this.http.put(`${baseUrl}/updateFamilyHead/${id}`, null);
  }

  updateRole(id: any, role: any): Observable<any> {
    return this.http.put(`${baseUrl}/updateRole/${id}/${role}`, null);
  }

  approveStatus(id: any): Observable<any> {
    return this.http.put(`${baseUrl}/approveStatus/${id}`, null);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByMemberId(memberId: any): Observable<FamilyMember[]> {
    return this.http.get<FamilyMember[]>(`${baseUrl}?memberId=${memberId}`);
  }
}
