import { Component, OnInit} from '@angular/core';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import { Member } from 'src/app/models/Member.model';
import { Router } from '@angular/router';
import { FamilyMember } from '../models/FamilyMember.model';

@Component({
  selector: 'app-birthdays',
  templateUrl: './birthdays.component.html',
  styleUrls: ['./birthdays.component.css']
})
export class BirthdaysComponent implements OnInit{
  constructor(
    private familyMemberService: FamilyMemberService
  ) {}

  allMembers: any[] = []; // List of all members
  birthdayMembers: any[] = []; // Filtered list for today's birthdays
  isLoading = true;  // Track the loading state

  ngOnInit(): void {
    this.fetchMembers();
  }

  fetchMembers() {
    this.isLoading = true;  // Show progress bar
    this.familyMemberService.getAllFamiliesForDefaultSearch().subscribe({
      next: (data) => {
        this.allMembers = data;
        if(this.allMembers !== undefined){
          this.filterTodayBirthdays();
          this.isLoading = false;
        }
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;  // Hide progress bar on error
      }
    });
  }

  filterTodayBirthdays(): void {
    const today = new Date(); // Get today's date
    const currentMonth = today.getMonth() + 1; // Months are zero-based
    const currentDay = today.getDate();

    this.birthdayMembers = this.allMembers.filter((member) => {
      const dob = new Date(member.dateOfBirth);
      const memberMonth = dob.getMonth() + 1;
      const memberDay = dob.getDate();

      return memberMonth === currentMonth && memberDay === currentDay;
    });
  }
}
