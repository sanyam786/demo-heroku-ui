import { Component, OnInit, ChangeDetectionStrategy, NgZone, ChangeDetectorRef, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { MapInfoWindow, MapMarker } from '@angular/google-maps';


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
    subArea: '',
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
    garamPani: '',
    latitude: 0,
    longitude: 0,
    createdByUser: '',
    lastUpdatedByUser: ''
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
 
  areaSubAreaMap: { [key: string]: string[] } = {
    "Amba Mata": ["Alkapuri", "Amba Mata", "Amba Mata Scheme", "Harsh Nagar", "Mulla Talai", "Rampura", "Sisarma", "Others"],
    "Ashok Nagar": ["Ashok Nagar", "Durga Nursery Road", "Shiv Park Colony", "Others"],
    "Ayad": ["Adarsh Nagar", "Ashok Vihar", "Ayad", "Friends Colony", "Heera bagh Colony", "Jain Colony", "Others"],
    "Bhupalpura": ["Alipura", "Bhupalpura", "Gumaniawala Nala", "Kharakuwa", "Krishnapura", "New Ashok Nagar", "New Bhupalpura", "Residency Road", "Sardarpura", "Others"],
    "Chetak": ["Bhatt ji ki Bari", "Chetak", "Hospital Road", "Madhuban", "Others"],
    "City Area": ["Amal Ka Kanta", "Ashwini Bazar", "Bada Bazar", "Bapu Bazar", "Bhadbhuja Ghati", "Bhadesar Chowk", "Bhoiwada", "Bhopalwadi", "Delhigate", "Dhanmandi", "Ghanta Ghar", "Gulab Bagh", "Hathipole", "Jagdish Chowk", "Kheradi Wada", "Lakhara Chowk", "Maldas Street", "Mandi Ki Naal", "Mehtaji ki badi", "Mewar Motors Link Road", "Mogra Wadi", "Moti Chowk", "Mukherjee Chowk", "Nada Khada", "Sarvaritu Vilas", "Shivaji Nagar", "Sindhi Bazar", "Others"],
    "Eklingpura": ["Eklingpura", "Manwakheda", "Others"],
    "Fatehpura": ["Ahinsapuri", "Badgaon", "Bedla", "Dewali", "Fatehpura", "Kharol Colony", "Navratan", "New Fatehpura", "New Navratan", "Old Fatehpura", "Pula", "R K Circle", "Syphon", "Others"],
    "Ganesh Nagar": ["Bekni Puliya", "Bohra Ganesh", "Dhulkot Choraha", "Ganesh Nagar", "Jaishree Colony", "Pahada", "University Road", "Others"],
    "Keshav Nagar": ["Abhinandan Complex", "Ashirwad Nagar", "Keshav Nagar", "Khanij Nagar", "Krishna Vihar", "New Ashok Vihar", "New Keshav Nagar", "Roopsagar Road", "Others"],
    "Madri": ["Arihant Vihar", "Madri", "Purohiton Ki Madri", "Surya Nagar", "Udai Vihar", "UIT Colony", "Others"],
    "Pratap Nagar": ["Pratap Nagar", "Nakoda Nagar", "Transport Nagar", "Others"],
    "Sector-3": ["Dore Nagar", "Eklingnath Colony", "Kesar Bagh", "MDS School", "New Shanti Nagar", "Nirmal Vihar", "Parshwanath Nagar", "Rishi Nagar", "Samta Nagar", "Sector 3", "Shanti Nagar", "Tilak Nagar", "Vivek Nagar", "Vivek Park", "Vrindavan Vihar", "Others"],
    "Sector-4": ["Adarsh nagar", "Chanakyapuri", "Gyan Nagar", "Mahaveer Nagar", "Mahaveeram Apartment", "Mayur Complex", "Nakoda Complex", "New Shiv Nagar", "New Vidhya Nagar", "Pooja Nagar", "Sarvottam Complex", "Sector 4", "Seva Nagar & Petro Pump Road", "Tagore Nagar", "Vaishali Apartment", "Vidhya Nagar", "Others"],
    "Sector-5": ["120 Feet", "Ashish Nagar", "Basant Vihar", "Ganpati Nagar", "Gariawas", "Gayatri Nagar", "Kashipuri", "Mali Colony", "Manva Kheda Road", "Nakoda Nagar", "Near Choudhary Hospital", "Near Milap Hospital", "Opp. Post Office Colony", "Paneriyon Ki Madri", "Prabhat Nagar", "Sector 5", "Shanti Nagar", "Sidharth Complex", "Tekri", "Tekri Road", "Tulsi Nagar", "Udai Park", "Vasant Vihar", "Others"],
    "Sector-6": ["Bappa Rawal Nagar", "Behind Police Station", "Shiv Colony", "Veena nagar", "Sector 6", "Others"],
    "Sector-7": ["Sector 7", "Gokul Village", "Others"],
    "Sector-8": ["Ganpati Vihar", "J. P. Nagar", "Kan Nagar", "Sanjay Gandhi Nagar", "Savina", "Vasant Vatika Road", "Others"],
    "Sector-9": ["Sector 9", "Others"],
    "Sector-11": ["Chandan Chhaya", "Kamla Hospital Gali", "Machhala Magra Scheme", "Mahaveer Complex", "Near Agarwal Dharmshala", "Opp. Samudayik Kendra", "Ram Singh Ji Badi", "Sambhavnath complex", "Sector 11", "Shahi Complex", "Shopping Centre", "Vinoba Complex", "Others"],
    "Sector-13": ["Govind Nagar", "Maharana Pratap Colony", "Near MVM School", "Near Navjeevan School", "Sector 13", "Others"],
    "Sector-14": ["Ambedkar Colony", "Arihant Nagar", "Balicha", "Basant Vihar", "CA Circle", "Chitrakoot Vihar", "D Block", "E-Block", "Gandhi Nagar", "G-Block", "Govardhan Vilas", "Housing board colony", "Mahaveer Nagar", "Moti Chetan Palace", "Near Ca Bhawan", "Nela Road", "Rhb Colony", "Rishabh Nagar", "Roshan Ji Ki Badi", "Sector-14", "Others"],
    "Sevashram": ["MB College", "Patho Ki Magri", "Sevashram", "Subhash Nagar", "Others"],
    "Shobhagpura": ["Bhuwana", "Chitrakoot Nagar", "Khelgaon", "Meera Nagar", "New RTO", "NRI Colony", "Raghunathpura", "Shobhagpura", "Sukher", "Others"],
    "Sundarwas": ["Glass Factory", "Kendriya Vidhyalaya", "North Sundarwas", "Ostwal Nagar", "South Sunderwas", "Others"],
    "UIT Circle": ["Batheda House", "Daitya Magri", "Moti Magri Scheme", "New Polo Ground", "Panchwati", "Polo Ground", "Saheli Nagar", "Sukhadia Circle", "UIT Circle", "Others"]
  };

  areas: string[] = Object.keys(this.areaSubAreaMap);
  subAreas: string[] = [];

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
  loggedInMemberId: any;
  familyMemberForAccessCheck?: FamilyMember;

  @ViewChild('searchBox', { static: false }) searchBox!: ElementRef<HTMLInputElement>;
  @ViewChild('marker') marker!: MapMarker;
  mapCenter = { lat: 24.5854, lng: 73.7125 }; // default to Udaipur
  markerPosition = { lat: 24.5854, lng: 73.7125 };
  autocompleteInitialized = false;
  addressLabel: string = '';

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
    this.loadFamilyData(this.loggedInMemberId);
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
          if (this.familyMember.area) {
            this.onAreaChange(this.familyMember.area);
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
            this.familyMember.lastUpdatedByUser = this.loggedInMemberId.toString();
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
            this.familyMember.createdByUser = this.loggedInMemberId.toString();
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
    if(this.familyMemberForAccessCheck != undefined && this.familyMemberForAccessCheck.members != undefined){
      for(let i=0; i < this.familyMemberForAccessCheck?.members.length; i++){
        if(this.loggedInRole === 'selfedit' && this.loggedInMemberId === this.familyMemberForAccessCheck.members[i].memberId){
          return true;
        }
      }
    }
    return false;
  }

  // isSelfEdit(memberId: any): boolean {
  //   if (this.familyMemberForAccessCheck && this.familyMemberForAccessCheck.members) {
  //     return this.familyMemberForAccessCheck.members.some(m =>
  //       this.loggedInRole === 'selfedit' && this.loggedInMemberId === m.memberId
  //     );
  //   }
  //   return false;
  // }

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
      if((this.loggedInRole === 'admin' ||  this.loggedInRole === 'edit') || this.isSelfEdit(this.loggedInMemberId)){
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

  ngAfterViewChecked(): void {
    if (this.searchBox && !this.autocompleteInitialized) {
      const input = this.searchBox.nativeElement;
      const autocomplete = new google.maps.places.Autocomplete(input);
  
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.geometry.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
  
            this.mapCenter = { lat, lng };
            this.markerPosition = { lat, lng };
            this.familyMember.latitude = lat;
            this.familyMember.longitude = lng;
          }
        });
      });
  
      this.autocompleteInitialized = true;  // flag to avoid re-initialization
    }
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.mapCenter = { lat, lng };
        this.markerPosition = { lat, lng };
        this.familyMember.latitude = lat;
        this.familyMember.longitude = lng;
        // ✅ Clear search box
        if (this.searchBox?.nativeElement) {
          this.searchBox.nativeElement.value = '';
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        this.openSnackBar('Location access denied or unavailable.', 'Close');
      });
    } else {
      this.openSnackBar('Geolocation not supported by this browser.', 'Close');
    }
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      this.markerPosition = { lat, lng };
      this.familyMember.latitude = lat;
      this.familyMember.longitude = lng;
    }
  }

  onMarkerDrag() {
    const position = this.marker.getPosition();
    if (position) {
      const lat = position.lat();
      const lng = position.lng();
      this.markerPosition = { lat, lng };
      this.familyMember.latitude = lat;
      this.familyMember.longitude = lng;
    }
  }

  preventSubmit(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
  }

  onAreaChange(selectedArea: string) {
    this.subAreas = this.areaSubAreaMap[selectedArea] || [];
  
    if (!this.familyMember.subArea || !this.subAreas.includes(this.familyMember.subArea)) {
      this.familyMember.subArea = '';
    }
  }
}
