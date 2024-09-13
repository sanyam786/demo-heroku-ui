import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FamilyMember } from '../models/FamilyMember.model';
import { Member } from '../models/Member.model';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-update-member',
  templateUrl: './create-update-member.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./create-update-member.component.css']
})
export class CreateUpdateMemberComponent  implements OnInit{
  // firstName: '';
  // lastName: '';
  // fatherName: '';
  // memberType: '';
  // gender: '';
  // dateOfBirth: '';
   //maritalStatusChk: string | undefined;
  // bloodGroup: '';
  // education: '';
  // permanentAddress: '';
  // mobile: '';
  // email: '';
  // area: '';
  // checkedSameAddress: boolean = false;
  // currentAddress: '';
  // proffession: '';
  // proffessionAddress: '';
  // proffessionEmail: '';
  // proffessionNumber: '';
  // checkIAffirm: '';
  // aborigine: '';

  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  formdata!: FormData;
  imageInBase64!: string; 

  familyMember: Member = {
    familyHead: false,
    firstName: '',
    lastName:  '',
    fatherName: '',
    gender: '',
    dateOfBirth: '',
    maritalStatus: '',
    bloodGroup: '',
    education: '',
    permanentAddress: '',
    mobile: '',
    altMobile: '',
    whatsappMobile: '',
    email: '',
    area: '',
    checkedSameAddress: false,
    checkedSameWhatsappNumber: false,
    currentAddress: '',
    profession: '',
    professionAddress: '',
    professionEmail: '',
    professionNumber: '',
    checkIAffirm: false,
    aborigine: '',
    status: 'Pending'
  };

  submitted!: Boolean;
  familyId: any = 0;
  memeberId: any;
  pageMode: string = '';
  alreadyExistingFamilyHead!: Boolean;
  alreadyExistingPhoneNumberForAnotherFamily!: Boolean;
  currentFamily!: FamilyMember;
  allFamilyMembers: any;
  MAX_FILE_SIZE = 1 * 1024 * 1024; // 2 MB in bytes

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private change: ChangeDetectorRef,
    private familyMemberService: FamilyMemberService
  ) {}

  ngOnInit(): void{
    this.memeberId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.pageMode = this.activatedRoute.snapshot.paramMap.get('pageMode')!;
    this.alreadyExistingFamilyHead = false;
    this.alreadyExistingPhoneNumberForAnotherFamily = false;
    this.familyMemberService.getFamilyByMemberId(this.memeberId).subscribe({
      next: (data) => {
        this.currentFamily = data;
        this.familyId = data.familyId;
        console.log(this.currentFamily);
        this.alreadyExistingFamilyHead = this.checkForAlreadyExistingFamilyHead(data);
      },
      error: (e) => console.error(e)
    });
    if(this.pageMode === 'edit'){
      this.familyMemberService.getMemberById(this.memeberId).subscribe({
        next: (data) => {
          this.familyMember = data;
          if(this.familyMember.checkedSameWhatsappNumber === null) {
            this.familyMember.checkedSameWhatsappNumber = false;
          }
          // if(this.familyMember.photo !== null) {
          //   this.selectedFile = this.familyMember.photo;
          // }
          console.log(data);
        },
        error: (e) => console.error(e)
      });
    }

    this.familyMemberService.getAll().subscribe({
      next: (data) => {
        this.allFamilyMembers = data;
      },
      error: (e) => console.error(e)
    });

  }

  onSaveOrUpdate(): void {
    if(this.familyMember.checkedSameAddress || (!this.familyMember.checkedSameAddress && this.familyMember.currentAddress)){
      if(this.familyMember.checkedSameWhatsappNumber || (!this.familyMember.checkedSameWhatsappNumber && this.familyMember.whatsappMobile)){
        if (this.familyMember.firstName && this.familyMember.lastName && this.familyMember.fatherName && this.familyMember.gender 
          && !this.checkMobileNumberErrors(this.familyMember.mobile)) {
          // if(this.selectedFile){
          //   this.onUpload();
          // }else if(this.familyMember.photo){
          //   this.setFormData();
          // }
          if(this.imageInBase64){
            this.familyMember.photo = this.imageInBase64;
          }
          if(this.pageMode === 'edit' && this.familyMember.photo){
            this.familyMemberService.update(this.familyMember, this.familyId).subscribe({
              next: (res) => {
                console.log(res);
                this.submitted = true;
                this.backToSearchPage(res.memberId);
              },
              error: (e) => console.error(e)
            });
          }else if(this.pageMode === 'edit' && !this.familyMember.photo) {
            this.openSnackBar('Error: Please upload photo of size less than 1 MB.', 'Close');
            console.error('Form is invalid');
          } 
          if(this.pageMode === 'create' && this.selectedFile){
            this.familyMemberService.create(this.familyMember, this.familyId).subscribe({
              next: (res) => {
                console.log(res);
                this.submitted = true;
                this.backToSearchPage(res.memberId);
              },
              error: (e) => console.error(e)
            });
          }else if(this.pageMode === 'create' && !this.selectedFile) {
            this.openSnackBar('Error: Please upload photo of size less than 1 MB.', 'Close');
            console.error('Form is invalid');
          }
          console.log('Family Member Data', this.familyMember);
        } else {  
          this.openSnackBar('Error: Mobile number entered belongs to already existing family.', 'Close');
          console.error('Form is invalid');
        }
      }else {
        this.openSnackBar('Error: WhatsApp number is required if not same as Primary mobile number.', 'Close');
            console.error('Form is invalid');
      }
    }else {
        this.openSnackBar('Error: Current address is required if not same as Permanent address.', 'Close');
            console.error('Form is invalid');
      }
  }
  

  backToSearchPage(memberId: any){
    if(memberId !== undefined && memberId !== null && memberId !== '' && memberId !== 0 && memberId !== "0"){
      this.router.navigate(['/dashboard', {id: memberId, afterSaveOrUpdate: true}]);
    }else {
      this.router.navigate(['/dashboard', {afterSaveOrUpdate: false}]);
    }
  }

  // onUpdate(): void {
  //   if (this.familyMember.firstName && this.familyMember.lastName && this.familyMember.fatherName && this.familyMember.gender && !this.checkMobileNumberErrors(this.familyMember.mobile)) {
  //     this.familyMemberService.update(this.familyMember, this.familyId).subscribe({
  //       next: (res) => {
  //         console.log(res);
  //         this.submitted = true;
  //       },
  //       error: (e) => console.error(e)
  //     });
  //   } else {
  //     this.openSnackBar('Error: Mobile number entered belongs to already existing family.', 'Close');
  //     console.error('Form is invalid');
  //   }
  // }

  // onFileSelected(event: any): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   var base64String = null;
  //   if (fileInput.files && fileInput.files[0]) {
  //     this.selectedFile = fileInput.files[0];


  //     // Preview the selected image
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       this.previewUrl = reader.result;
  //       base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
  //     };
  //     reader.readAsDataURL(this.selectedFile);
  //     if(base64String !== null){
  //       this.familyMember.photo = base64String;
  //     }
  //   }
  // }
  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
  
      
        // Preview the selected image
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = reader.result as string; // Typecast result to string
        this.previewUrl = result;
        
        // Extract the Base64 portion of the Data URL
        const base64String = result.replace("data:", "").replace(/^.+,/, "");
        this.imageInBase64= base64String;
        // // Convert Base64 string to Blob
        // const byteString = atob(base64String);
        // const byteNumbers = new Array(byteString.length);
        // for (let i = 0; i < byteString.length; i++) {
        //   byteNumbers[i] = byteString.charCodeAt(i);
        // }
        // const byteArray = new Uint8Array(byteNumbers);
        // if(this.selectedFile !== null){
        //   const blob = new Blob([byteArray], { type: this.selectedFile.type });
        //   this.familyMember.photo = blob;
        // }  
      };
      reader.readAsDataURL(this.selectedFile);
      
    }
  }

  // onUpload(): Boolean {
  //   if (this.selectedFile) {
  //     if (this.selectedFile.size > this.MAX_FILE_SIZE) {
  //       //alert('File is too large!');
  //       return false;
  //     }
  //     const fileInput = document.getElementById('fileInput');

  //     //fileInput.addEventListener('change', function() {
  //         const file = this.selectedFile;
  //         const reader = new FileReader();
          
  //         if(reader !== null && reader.result !== null){
  //           reader.onloadend = function() {
  //             const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
  //             const payload = {
  //                 fileContent: base64String
  //             };

  //             this.f

  //             // fetch('/upload', {
  //             //     method: 'POST',
  //             //     headers: {
  //             //         'Content-Type': 'application/json'
  //             //     },
  //             //     body: JSON.stringify(payload)
  //             // })
  //             // .then(response => response.json())
  //             // .then(data => console.log(data));
  //         };

  //         reader.readAsDataURL(file);
  //         }
          
  //    // });
  //     // this.formdata = new FormData();
  //     // this.formdata.append('file', this.selectedFile);
  //     // this.formdata.append(
  //     //   'familyMember',
  //     //   new Blob([JSON.stringify(this.familyMember)], { type: 'application/json' })
  //     // );
  //     return true
  //   }
  //   return false;
  // }

  setFormData() {
    this.formdata = new FormData();
    this.formdata.append(
      'familyMember',
      new Blob([JSON.stringify(this.familyMember)], { type: 'application/json' })
    );
  }
  
  goBack(id: string): void {
    this.router.navigate(['/family', id]);
  }

  checkForAlreadyExistingFamilyHead(data: any): Boolean{
    const familyMembers = data.members;
    for(var i=0; i < familyMembers.length; i++){
      if(familyMembers[i].familyHead){
        return true;
      }
    }
    return false;
  }

  checkMobileNumberErrors(mobile: any){
    //const inputMobileNumber = event.target.value;
    this.alreadyExistingPhoneNumberForAnotherFamily = this.checkForAlreadyExistingPhoneNumberForAnotherFamily(mobile);
    //this.change.detectChanges();
    return this.alreadyExistingPhoneNumberForAnotherFamily;
  }

  checkForAlreadyExistingPhoneNumberForAnotherFamily(inputMobileNumber: any): Boolean {
    const allmembers = this.allFamilyMembers;
    var currentFamilyMembers: any[];
    if(this.currentFamily !== null && this.currentFamily !== undefined && this.currentFamily.members !== undefined && this.currentFamily.members?.length> 0){
      currentFamilyMembers = this.currentFamily.members;
    }else {
      currentFamilyMembers = [];
    }

    if(allmembers !== null && allmembers !== undefined && allmembers.length > 0){
      var i = allmembers.length
      while (i--) {
        if(currentFamilyMembers !== undefined){
          for(let j=0; j<currentFamilyMembers.length; j++)
            {
              if (allmembers[i].memberId === currentFamilyMembers[j].memberId) { 
                  allmembers.splice(i, 1);
              }
            }
        }
      }

      for(let k=0; k<allmembers.length; k++){
          if (allmembers[k].mobile === inputMobileNumber) { 
              return true;
          }
      }
    }

    return false;
    // var allowedPhNumbers: any;

    // if(currentFamilyMembers !== undefined && currentFamilyMembers.length > 0){
    //   for(let i=0; i<currentFamilyMembers.length; i++)
    //   { 
    //     allowedPhNumbers[i] = currentFamilyMembers[i].mobile;
    //   }
    //   for(var i=0; i < allmembers.length; i++){
    //     for(let j=0; j<currentFamilyMembers.length; j++){
    //       if(allmembers[i].memberId !== currentFamilyMembers[j].memberId && allowedPhNumbers.includes(allmembers[i].mobile)){
    //         return true;
    //       }
    //     }
    //   }
    // }
    // return false;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  onSameAddressCheck(event: any){
    if(event.target.checked || (this.pageMode === 'edit' && this.familyMember.checkedSameAddress)){
      this.familyMember.currentAddress = this.familyMember.permanentAddress;
    }else {
      //this.familyMember.currentAddress = '';
    }
    console.log(event.target.value);
  }

  onSameWhatsAppNumberCheck(event: any){
    if(event.target.checked || (this.pageMode === 'edit' && this.familyMember.checkedSameWhatsappNumber)){
      this.familyMember.whatsappMobile = this.familyMember.mobile;
    }else {
      //this.familyMember.whatsappMobile = '';
    }
    console.log(event.target.value);
  }
}
