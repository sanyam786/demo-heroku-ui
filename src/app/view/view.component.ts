import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import { FamilyMember } from 'src/app/models/FamilyMember.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  id!: string;
  familyMember?: FamilyMember;
  pageMode!: string;
  submitted!: boolean;
  readonly panelOpenState = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familyMemberService: FamilyMemberService,
    //private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Retrieve the id from the route parameters
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadData(this.id); // Call a method to load data based on the id
  }

  loadData(id: string): void {
    this.familyMemberService.getFamilyByMemberId(id).subscribe({
      next: (data) => {
        this.familyMember = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  onEditMember(memberId: string) {
    this.pageMode = 'edit';
    // Navigate to the view component and pass the id
    this.router.navigate(['/create-update-member', {id: memberId, pageMode: this.pageMode}]);
  }

  onUpdateFamilyHead(memberId: string){
    this.familyMemberService.updateFamilyHead(memberId).subscribe({
      next: (res) => {
        console.log(res);
        this.loadData(memberId);
        //this.changeDetectorRef.markForCheck();
      },
      error: (e) => console.error(e)
    });
  }

  onApproveStatus(memberId: string){
    this.familyMemberService.approveStatus(memberId).subscribe({
      next: (res) => {
        console.log(res);
        this.loadData(memberId);
        //this.changeDetectorRef.markForCheck();
      },
      error: (e) => console.error(e)
    });
  }

  getAge(dateOfBirth: string): number {
    if (!dateOfBirth) {
      return 0; // Handle undefined dates
    }
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }
}