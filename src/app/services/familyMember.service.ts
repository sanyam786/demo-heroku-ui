import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  constructor(private http: HttpClient) {}

  getAll(): Observable<FamilyMember[]> {
    return this.http.get<FamilyMember[]>(baseUrl + '/families');
  }

  getAllFamiliesForDefaultSearch(): Observable<Member[]> {
    return this.http.get<Member[]>(baseUrl + '/defaultfamilies');
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
