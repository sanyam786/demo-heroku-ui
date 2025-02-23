import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef, inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FamilyMember } from '../models/FamilyMember.model';
import { Member } from '../models/Member.model';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NgxImageCompressService } from 'ngx-image-compress';


@Component({
  selector: 'app-create-update-member',
  templateUrl: './create-update-member.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./create-update-member.component.css']
})
export class CreateUpdateMemberComponent  implements OnInit{
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  formdata!: FormData;
  imageInBase64!: string; 
  isLoading = true;  // Track the loading state
  isLoadingOnSubmit = false;
  @ViewChild('memberForm') memberForm!: NgForm;
  isFormSubmitted = false; // Track if the form has been submitted


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
    status: 'Pending',
    role: '',
    ratriBhojanTyag: '',
    dhowanPani: '',
    professiondd: '',
    navkarsi: '',
    sthanak: [],
    interest: [],
    availability: '',
    monthlyHours: '',
    sameAddAsFamilyHeadAddCheck: false,
    garamPani: ''
  };

  allSthanks: string[] = [
    "Ahinsapuri Jain Sthanak Bhawan,Fatehpura",
    "Aradhana Bhawan,Moti Magri Scheme,Near Jain Mandir",
    "Devendra Dham, opp celebration Mall",
    "Lokashah Jain Sthanak,Ashok Nagar",
    "Mahaveer Bhawan Sector 11",
    "Mahaveer Bhawan Sector 5",
    "Mahaveer Bhawan Subash Nagar",
    "Mahaveer Bhawan, Sector 3",
    "Mahaveer Jain Bhawan , Ganesh Nagar",
    "Mahaveer Jain Shwetambar Samiti Sector 14",
    "Mahaveer Swadhyay Smiti,Ambamata",
    "Mahaveer bhawan Sunderwas",
    "Mohan Gyan Mandir & Juwar Bhawan, Bhopalpura",
    "Nakoda Nagar Jain Sthanak, Nakoda Nagar",
    "Ostwal Bhawan,Panchayati Noyra,Porwal Ka Noyra,mukherjee chowk",
    "Rishabh Bhawan, Ayad",
    "Shree Vardhman Sthanakwasi Jain Shravak Sansthan, Sector 4",
    "Shri Jain Dharm Sthanak,Sector 14"
  ];

  areas: string[] = [
    "Amba Mata", "Alkapuri", "Amba Mata Scheme", "Harsh Nagar", "Mulla Talai",
    "Mulla Talai Choraha", "Rampura Choraha", "Rampura Road", "Sisarma Road", "Ashok Nagar",
    "Durga Nursery Road", "Ayad", "Adarsh Nagar", "Ashirwad Nagar", "Ashok Vihar",
    "Friends Colony", "Heera bagh Colony", "Jain Colony", "Keshav Nagar", "Khanij Nagar",
    "New Ashok Vihar", "New Bhupalpura", "New Keshav Nagar", "New RTO", "University Road",
    "Bhopalpura", "Bhatt ji ki Bari", "Gumaniawala nala", "hospital road", "madhuvan",
    "New Ashok Nagar", "New Bhopalpura", "New Navratan", "Residency Road", "Sardarpura",
    "Bhuwana", "Shobhagpura", "Meera Nagar", "Fatehpura", "Badgaon", "Bedla",
    "Bedla Road", "Dewali", "New Fatehpura", "Old Fatehpura", "Pulla", "R K Circle",
    "Sukhadia Circle", "Syphon", "Moti Magri Scheme", "Daitya Magri", "Panchwati",
    "Saheli Nagar", "Polo Ground", "New Polo Ground", "Ganesh Nagar", "Bohra Ganesh",
    "Bohra Ganesh ji Main Road", "Dhulkot Choraha", "Ganesh Nagar", "Pahada",
    "University Campus", "Goverdhan vilas", "Sector 14", "Mewar Motors Gali",
    "Gulab Bagh Road", "Mehtaji ki badi", "Mogra wadi", "Shivaji Nagar", "Sarvaritu Vilas",
    "Amal Ka Kanta", "Ashwini Bazar", "Bada Bazar", "Bapu Bazar", "Bhadbhuja Ghati",
    "Bhadesar Chowk", "Bhoiwada", "Bhopalwadi", "Delhigate", "Dhanmandi", "Ghanta Ghar",
    "Hathipole", "Jagdish Chowk", "Kheradi Wada", "Lakhara Chowk", "Mandi Ki Naal",
    "Moti Chowk", "Mukherjee Chowk", "Sindhi Bazar", "Maldas Street", "Madri Industrial Area",
    "Madri Road", "Pratap Nagar", "North Sunderwas", "Ostwal Nagar", "South Sunderwas",
    "Purohito Ki Madri", "Nakoda Nagar", "Dhuauji ki Badi", "N B Nagar", "RK Puram",
    "Bhuwana", "Navratan Complex", "New Navratan", "Sukher", "Sector 3", "Kesar Bagh",
    "MDS School", "Dore Nagar", "Vrindavan Vihar", "Vivek Nagar", "Tilak Nagar",
    "Shanti Nagar & New Shanti Nagar", "Samta Nagar", "Vivek Park & Eklingnath Colony",
    "Nirmal Vihar", "Rishi Nagar & Samta Nagar", "Parshwanath Nagar", "Sector 4",
    "Vidhya Nagar", "Vaishali Apartment", "Tagore Nagar", "Seva Nagar & Petro Pump Road",
    "Sarvottam Complex", "New Vidhya Nagar", "New Shiv Nagar", "Nakoda Complex",
    "Mayur Complex", "Mahaveeram Apartment", "Mahaveer Nagar", "Gyan Nagar & Pooja Nagar",
    "Chanakyapuri", "Adarsh nagar", "Sector 5", "Eklingpura", "Manwa Kheda",
    "Paneriyon Ki Madri", "Gariawas", "Mali Colony", "Tekri", "Tekri Road",
    "Kashipuri", "Savina", "Sector 6", "Sector 7", "Sector 8", "Sector 9",
    "Machla Magra", "Sector 11", "Sector 13", "Sector 14", "Balicha", "Subash nagar",
    "opp M B College", "Patho Ki Magri", "Sevashram Choraha"
  ];

  submitted!: Boolean;
  familyId: any = 0;
  memeberId: any;
  pageMode: string = '';
  alreadyExistingFamilyHead!: Boolean;
  alreadyExistingPhoneNumberForAnotherFamily!: Boolean;
  currentFamily!: FamilyMember;
  allFamilyMembers: any;
  fileSizeError: boolean = false; // To show/hide file size error
  maxFileSize: number = 100 * 1024; // 100 KB in bytes
  loggedInRole = '';
  loggedInMemberId = 0;
  familyMemberForAccessCheck?: FamilyMember;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private change: ChangeDetectorRef,
    private familyMemberService: FamilyMemberService,
    private imageCompress: NgxImageCompressService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void{
    this.isLoading = true;  // Show progress bar
    this.memeberId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.pageMode = this.activatedRoute.snapshot.paramMap.get('pageMode')!;
    this.loggedInRole = this.familyMemberService.getLoggedInRole();
    this.loggedInMemberId = this.familyMemberService.getLoggedInMemberId();
    //this.alreadyExistingFamilyHead = false;
    this.alreadyExistingPhoneNumberForAnotherFamily = false;
    this.familyMemberService.getFamilyByMemberId(this.memeberId).subscribe({
      next: (data) => {
        this.currentFamily = data;
        this.familyId = data.familyId;
        //console.log(this.currentFamily);
        this.alreadyExistingFamilyHead = this.checkForAlreadyExistingFamilyHead(data);
      },
      error: (e) => {
        console.error(e);
        this.alreadyExistingFamilyHead = false;
        this.isLoading = false;  // Hide progress bar on error
      }
    });
    if(this.pageMode === 'edit'){
      this.isLoading = true;  // Show progress bar
      this.familyMemberService.getMemberById(this.memeberId).subscribe({
        next: (data) => {
          this.familyMember = data;
          if(this.familyMember.checkedSameWhatsappNumber === null) {
            this.familyMember.checkedSameWhatsappNumber = false;
          }
          this.isLoading = false;
          // if(this.familyMember.photo !== null) {
          //   this.selectedFile = this.familyMember.photo;
          // }
          //console.log(data);
        },
        error: (e) => {
          console.error(e);
          this.isLoading = false;  // Hide progress bar on error
        }
      });
    }

    this.familyMemberService.getAllFamiliesForDefaultSearch().subscribe({
      next: (data) => {
        this.allFamilyMembers = data;
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;  // Hide progress bar on error
      }
    });

  }

  onSaveOrUpdate(): void {
    this.isFormSubmitted = true; // Mark that the form has been submitted

    if (!this.memberForm || this.memberForm.invalid) {
      console.log("❌ Form is invalid, cannot submit.");
      return; // Prevent submission if form is invalid
    }

    console.log("✅ Form is valid, proceeding with submission.");
  
    // Proceed with saving/updating logic...
    if (this.isLoadingOnSubmit) return; // Prevent duplicate submissions
  
    if (this.familyMember.sameAddAsFamilyHeadAddCheck ||
      (this.familyMember.checkedSameAddress ||
      (!this.familyMember.checkedSameAddress && this.familyMember.currentAddress))
    ) {
      if (
        this.familyMember.checkedSameWhatsappNumber ||
        (!this.familyMember.checkedSameWhatsappNumber && this.familyMember.whatsappMobile)
      ) {
        if (
          this.familyMember.firstName &&
          this.familyMember.lastName &&
          this.familyMember.fatherName &&
          this.familyMember.gender &&
          this.familyMember.dhowanPani &&
          this.familyMember.ratriBhojanTyag &&
          !this.checkMobileNumberErrors(this.familyMember.mobile)
        ) {
          this.isLoadingOnSubmit = true; // Start the spinner
    
          if (this.imageInBase64) {
            this.familyMember.photo = this.imageInBase64;
          }
    
          // Update mode logic
          if (this.pageMode === 'edit' && this.familyMember.photo) {
            this.familyMemberService.update(this.familyMember, this.familyId).subscribe({
              next: (res) => {
                setTimeout(() => {
                  this.isLoadingOnSubmit = false; // Stop the spinner after delay
                  this.submitted = true;
                  this.openSnackBarWithDuration('Success: Member updated successfully.', 'Close');
                  this.backToSearchPage(res.memberId);
                }, 1000); // Simulate 1 second delay
              },
              error: (e) => {
                setTimeout(() => {
                  this.isLoadingOnSubmit = false; // Stop spinner after error delay
                  console.error(e);
                  this.openSnackBar('Error: Failed to update member.', 'Close');
                }, 1000); // Simulate 1 second delay
              },
            });
          } else if (this.pageMode === 'edit' && !this.familyMember.photo) {
            this.isLoadingOnSubmit = false; // Stop the spinner
            this.openSnackBar('Error: Please upload photo.', 'Close');
          }
    
          // Create mode logic
          if (this.pageMode === 'create' && this.selectedFile) {
            this.familyMember.role = 'selfedit';
            this.familyMemberService.create(this.familyMember, this.familyId).subscribe({
              next: (res) => {
                setTimeout(() => {
                  this.isLoadingOnSubmit = false; // Stop the spinner after delay
                  this.submitted = true;
                  this.openSnackBarWithDuration('Success: Member added successfully.', 'Close');
                  this.backToSearchPage(res.memberId);
                }, 1000); // Simulate 1 second delay
              },
              error: (e) => {
                setTimeout(() => {
                  this.isLoadingOnSubmit = false; // Stop spinner after error delay
                  console.error(e);
                  this.openSnackBar('Error: Failed to add member.', 'Close');
                }, 1000); // Simulate 1 second delay
              },
            });
          } else if (this.pageMode === 'create' && !this.selectedFile) {
            this.isLoadingOnSubmit = false; // Stop the spinner
            this.openSnackBar('Error: Please upload photo of size less than 1 MB.', 'Close');
          }
        } else {
          this.openSnackBar('Error: Mobile number entered belongs to already existing family.', 'Close');
        }
      } else {
        this.openSnackBar(
          'Error: WhatsApp number is required if not same as Primary mobile number.',
          'Close'
        );
      }
    } else {
      this.openSnackBar(
        'Error: Current address is required if not same as Permanent address.',
        'Close'
      );
    }
  }  

  backToSearchPage(memberId: any){
    if(memberId !== undefined && memberId !== null && memberId !== '' && memberId !== 0 && memberId !== "0"){
      this.router.navigate(['/dashboard', {id: memberId, afterSaveOrUpdate: true}]);
    }else {
      this.router.navigate(['/dashboard', {afterSaveOrUpdate: false}]);
    }
  }

  // onFileSelected(event: any): void {
  //   const fileInput = event.target as HTMLInputElement;
    
  //   if (fileInput.files && fileInput.files[0]) {
  //     this.selectedFile = fileInput.files[0];
  
  //     // Check file size
  //     if (this.selectedFile.size > this.maxFileSize) {
  //       this.fileSizeError = true; // Show error message
  //       this.previewUrl = null;    // Clear preview URL
  //       return; // Stop further execution
  //     } else {
  //       this.fileSizeError = false; // Hide error message
  //     }
  
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const result = reader.result as string;
  
  //       // Set the image preview URL
  //       this.previewUrl = result;
  
  //       // Extract the Base64 string and store it in the familyMember.photo
  //       const base64String = result.split(',')[1];
  //       this.familyMember.photo = base64String;
  //     };
  //     reader.readAsDataURL(this.selectedFile);
  //   }
  // }

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
  
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
  
      if (this.selectedFile.size > this.maxFileSize) {
        this.compressImage(this.selectedFile);
      } else {
        this.convertToBase64(this.selectedFile);
      }
    }
  }
  
  // ✅ Ensure preview is updated after compression
  compressImage(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imageBase64 = reader.result as string;
      let quality = 80;
      let width = 50;
      let height = 50;
      let lastSizeInKB = 0;
      const startTime = performance.now(); // Start compression timer
  
      const compressUntilSize = (imageDataUrl: string, quality: number, width: number, height: number) => {
        this.imageCompress.compressFile(imageDataUrl, -1, quality, width).then((compressedImage) => {
          let compressedSize = this.imageCompress.byteCount(compressedImage);
          let compressedSizeInKB = (compressedSize / 1024).toFixed(2);
          lastSizeInKB = parseFloat(compressedSizeInKB);
  
          console.log(`📉 Compressed Image Size: ${compressedSizeInKB} KB (Quality: ${quality}, Width: ${width}, Height: ${height})`);
  
          if (compressedSize <= this.maxFileSize) {
            const endTime = performance.now(); // End compression timer
            console.log(`✔️ Final Compressed Size: ${compressedSizeInKB} KB`);
            console.log(`⏳ Compression Time: ${(endTime - startTime).toFixed(2)} ms`);
  
            // ✅ Force Angular UI update
            this.ngZone.run(() => {
              this.imageInBase64 = compressedImage.split(',')[1];
              this.previewUrl = compressedImage; // ✅ Ensures new reference for UI update
              this.change.detectChanges(); // 🔥 Refresh UI
            });
  
            return;
          } else if (quality > 10) {
            quality -= 10;
            width -= 10;
            height -= 10;
            console.log(`⚠️ Retrying with Quality ${quality}, Width ${width}, Height ${height}...`);
            compressUntilSize(imageDataUrl, quality, width, height);
          } else {
            console.warn("❌ Cannot compress further without major quality loss.");
            console.log(`🚨 Last Converted Size: ${lastSizeInKB} KB`);
  
            // Ensure UI updates when compression fails
            this.ngZone.run(() => {
              this.fileSizeError = true;
              this.change.detectChanges();
            });
          }
        });
      };
  
      compressUntilSize(imageBase64, quality, width, height);
    };
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imageInBase64 = (reader.result as string).split(',')[1]; // Store Base64
      this.previewUrl = reader.result; // Show image preview
    };
  }

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

  checkForAlreadyExistingFamilyHead(data: any): boolean{
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
                  break;
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
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }

  openSnackBarWithDuration(message: string, action: string) {
    this._snackBar.open(message, action, {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 8 * 1000
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

  onSameAddressAsFamilyHeadCheck(event: any){
    this.familyMember.sameAddAsFamilyHeadAddCheck = event.target.checked;
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

  isSelfEdit(memberId: any): any {
    this.loadFamilyData(memberId);
    if(this.familyMemberForAccessCheck != undefined && this.familyMemberForAccessCheck.members != undefined){
      for(let i=0; i < this.familyMemberForAccessCheck?.members.length; i++){
        if(this.loggedInRole === 'selfedit' && this.loggedInMemberId === this.familyMemberForAccessCheck.members[i].memberId){
          return true;
        }
      }
    }
    return false;
  }

  loadFamilyData(id: string): void {
    //this.isLoading = true;  // Show progress bar
    this.familyMemberService.getFamilyByMemberId(id).subscribe({
      next: (data) => {
        this.familyMemberForAccessCheck = data;
        //this.isLoading = false;
        //console.log(data);
      },
      error: (e) => {
        console.error(e);
        //this.isLoading = false;  // Hide progress bar on error
      }
    });
  }

  checkRoles(): any {
    if(this.pageMode === 'edit'){
      if((this.loggedInRole === 'admin' ||  this.loggedInRole === 'edit') || this.isSelfEdit(this.familyMember.memberId)){
        return true;
      }
    }

    if(this.pageMode === 'create'){
      if(this.loggedInRole === 'admin' ||  this.loggedInRole === 'edit'){
        return true;
      }
    }
    return false;
  }
}
