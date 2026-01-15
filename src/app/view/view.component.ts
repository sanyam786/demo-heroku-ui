import { Component, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, signal, inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import { FamilyMember } from 'src/app/models/FamilyMember.model';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

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
  isLoading = true;  // Track the loading state
  loggedInRole = '';
  loggedInMemberId = 0;
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  fullImage: string | null = null;
  openedMemberId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familyMemberService: FamilyMemberService,
    //private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Retrieve the id from the route parameters
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.openedMemberId = parseInt(this.id, 10);
    this.loggedInRole = this.familyMemberService.getLoggedInRole();
    this.loggedInMemberId = this.familyMemberService.getLoggedInMemberId();
    this.loadData(this.id); // Call a method to load data based on the id
  }

  loadData(id: string): void {
    this.isLoading = true;  // Show progress bar
    this.familyMemberService.getFamilyByMemberId(id).subscribe({
      next: (data) => {
        this.familyMember = data;
        this.isLoading = false;
        //console.log(data);
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;  // Hide progress bar on error
      }
    });
  }

  onEditMember(memberId: string) {
    this.pageMode = 'edit';
    // Navigate to the view component and pass the id
    this.router.navigate(['/create-update-member', {id: memberId, pageMode: this.pageMode, pageFrom: 'existingUser'}]);
  }

  onUpdateFamilyHead(memberId: string){
    this.familyMemberService.updateFamilyHead(memberId).subscribe({
      next: (res) => {
        console.log(res);
        this.openSnackBarWithDuration('Success: Family Head updated successfully.', 'Close', 'success');
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
        this.openSnackBarWithDuration('Success: Member approved successfully.', 'Close','success');
        this.loadData(memberId);
        //this.changeDetectorRef.markForCheck();
      },
      error: (e) => console.error(e)
    });
  }

  onDelete(memberId: string){
    this.familyMemberService.delete(memberId).subscribe({
      next: (res) => {
        console.log(res);
        this.openSnackBarWithDuration(res.message, 'Close','success');
        if(this.id !== memberId.toString()){
          this.loadData(this.id);
        } else {
          this.router.navigate(['/dashboard']);
        }
        //this.changeDetectorRef.markForCheck();
      },
      error: (e) => console.error(e)
    });
  }

  getAge(dateOfBirth: string): string {
    if (!dateOfBirth) {
      return '00'; // Handle undefined dates
    }
  
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
  
    // Adjust age if birth month/day hasn't passed yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    // Return age as a string, pad with '0' if the age is a single digit
    return age < 10 ? `0${age}` : `${age}`;
  }

  isSelfEdit(memberId: any): any {
    if(this.familyMember != undefined && this.familyMember.members != undefined){
      for(let i=0; i < this.familyMember?.members.length; i++){
        if(this.loggedInRole === 'selfedit' && this.loggedInMemberId === this.familyMember.members[i].memberId){
          return true;
        }
      }
    }
    return false;
  }

  checkRoles(): any {
    if(this.loggedInRole === 'admin' ||  this.loggedInRole === 'edit'){
      return true;
    }
    return false;
  }

  checkAdminRole(): any {
    if(this.loggedInRole === 'admin'){
      return true;
    }
    return false;
  }

  openSnackBar(message: string, action: string, type: 'success' | 'error') {
    const panelClass = type === 'success' ? 'success-snackbar' : 'error-snackbar';
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: [panelClass]
    });
  }

  // openSnackBarWithDuration(message: string, action: string) {
  //   this._snackBar.open(message, action, {
  //     horizontalPosition: this.horizontalPosition,
  //     verticalPosition: this.verticalPosition,
  //     duration: 8 * 1000
  //   });
  // }

  openSnackBarWithDuration(message: string, action: string, type: 'success' | 'error') {
    const panelClass = type === 'success' ? 'success-snackbar' : 'error-snackbar';
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 48 * 1000,
      panelClass: [panelClass]
    });
  }

  onRoleChange(event: any, memberId: any): void {
    console.log('Role changed to: ', event.value);
    var role = event.value;
    this.familyMemberService.updateRole(memberId, role).subscribe({
      next: (res) => {
        console.log(res);
        this.openSnackBarWithDuration('Success: Member role updated successfully.', 'Close', 'success');
        this.loadData(memberId);
        //this.changeDetectorRef.markForCheck();
      },
      error: (e) => console.error(e)
    });
  }

  openAiBox() {
    this.router.navigate(['/aibox']);
  }

  openImageViewer(photo: string) {
    this.fullImage = photo;
  }

  scrollToMember(elementRef: HTMLElement) {
    setTimeout(() => {
      elementRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300); // Delay to ensure panel expansion is complete
  }
}
