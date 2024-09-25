import {AfterViewInit, OnInit, Component, ViewChild, ChangeDetectionStrategy, Input} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TutorialService } from 'src/app/services/tutorial.service';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import { Member } from 'src/app/models/Member.model';
import { Router } from '@angular/router';
import { FamilyMember } from '../models/FamilyMember.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-allsearch',
  templateUrl: './allsearch.component.html',
  styleUrls: ['./allsearch.component.css']
})
export class AllsearchComponent {
  searchForm!: FormGroup;
  //members: Member[] = [];
  filteredMembers: Member[] = [];

  searchQuery: string = '';
  members?: Member[];
  member?: Member;
  pageMode: string = '';
  dataSource!: MatTableDataSource<Member>;
  displayedColumns: string[] = ['actions', 'firstName', 'fatherName', 'mobile', 'area', 'profession', 'bloodGroup', 'status'];
  isLoading = true;  // Track the loading state

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(
    private familyMemberService: FamilyMemberService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void{
    this.clearSearchForm();
    this.onSearch();
  }

  ngAfterViewInit() {
  }

  clearSearchForm() {
    // Initialize the form with empty values for all fields
    this.searchForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      fatherName: [''],
      gender: [''],
      dateOfBirth: [''],
      maritalStatus: [''],
      bloodGroup: [''],
      education: [''],
      permanentAddress: [''],
      mobile: [''],
      altMobile: [''],
      whatsappMobile: [''],
      email: [''],
      area: [''],
      currentAddress: [''],
      profession: [''],
      professionAddress: [''],
      professionEmail: [''],
      professionNumber: [''],
      aborigine: [''],
      status: [''],
      familyHead: ['']
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchAll() {
    this.clearSearchForm();
    this.onSearch();
    // this.isLoading = true;  // Show progress bar
    // this.familyMemberService.getAllFamiliesForDefaultSearch().subscribe({
    //   next: (data) => {
    //     this.members = data;
    //     if(this.members !== undefined){
    //     this.filteredMembers = data;
    //     this.dataSource = new MatTableDataSource(this.members);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //     this.isLoading = false;
    //     }
    //    // console.log(data);
    //   },
    //   error: (e) => {
    //     console.error(e);
    //     this.isLoading = false;  // Hide progress bar on error
    //   }
    // });
  }


  onViewDetails(id: string) {
    // Navigate to the view component and pass the id
    this.router.navigate(['/view', id]);
  }

  // Search functionality
  onSearch() {
    this.isLoading = true;
    const formValues = this.searchForm.value;

    this.familyMemberService.searchMembers(formValues).subscribe({
      next: (data: Member[]) => {
        this.filteredMembers = data;
        this.dataSource = new MatTableDataSource(this.filteredMembers);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching members', err);
        this.isLoading = false;
      }
    });
    // const formValues = this.searchForm.value;
    // if(this.members !== undefined){
    //   this.filteredMembers = this.members.filter(member =>
    //     (!formValues.firstName || member.firstName?.toLowerCase().includes(formValues.firstName.toLowerCase())) &&
    //     (!formValues.lastName || member.lastName?.toLowerCase().includes(formValues.lastName.toLowerCase())) &&
    //     (!formValues.fatherName || member.fatherName?.toLowerCase().includes(formValues.fatherName.toLowerCase())) &&
    //     (!formValues.gender || member.gender?.toLowerCase().includes(formValues.gender.toLowerCase())) &&
    //     (!formValues.dateOfBirth || member.dateOfBirth?.includes(formValues.dateOfBirth)) &&
    //     (!formValues.maritalStatus || member.maritalStatus?.toLowerCase().includes(formValues.maritalStatus.toLowerCase())) &&
    //     (!formValues.bloodGroup || member.bloodGroup?.toLowerCase().includes(formValues.bloodGroup.toLowerCase())) &&
    //     (!formValues.education || member.education?.toLowerCase().includes(formValues.education.toLowerCase())) &&
    //     (!formValues.permanentAddress || member.permanentAddress?.toLowerCase().includes(formValues.permanentAddress.toLowerCase())) &&
    //     (!formValues.mobile || member.mobile?.includes(formValues.mobile)) &&
    //     (!formValues.altMobile || member.altMobile?.includes(formValues.altMobile)) &&
    //     (!formValues.whatsappMobile || member.whatsappMobile?.includes(formValues.whatsappMobile)) &&
    //     (!formValues.email || member.email?.toLowerCase().includes(formValues.email.toLowerCase())) &&
    //     (!formValues.area || member.area?.toLowerCase().includes(formValues.area.toLowerCase())) &&
    //     (!formValues.currentAddress || member.currentAddress?.toLowerCase().includes(formValues.currentAddress.toLowerCase())) &&
    //     (!formValues.profession || member.profession?.toLowerCase().includes(formValues.profession.toLowerCase())) &&
    //     (!formValues.professionAddress || member.professionAddress?.toLowerCase().includes(formValues.professionAddress.toLowerCase())) &&
    //     (!formValues.professionEmail || member.professionEmail?.toLowerCase().includes(formValues.professionEmail.toLowerCase())) &&
    //     (!formValues.professionNumber || member.professionNumber?.includes(formValues.professionNumber)) &&
    //     (!formValues.aborigine || member.aborigine?.toLowerCase().includes(formValues.aborigine.toLowerCase())) &&
    //     (!formValues.status || member.status?.toLowerCase().includes(formValues.status.toLowerCase()))
    //   );
    //}
  }
  
   // Export search results to Excel
   exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filteredMembers);
    const workbook: XLSX.WorkBook = { Sheets: { 'Members': worksheet }, SheetNames: ['Members'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'members');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  // Export search results to PDF
exportToPDF(): void {
    const doc = new jsPDF();
    
    // Set title
    doc.text('Member Search Results', 14, 16);
    
    // Convert JSON data to table
    (doc as any).autoTable({
      head: [['First Name', 'Last Name', 'Mobile', 'Email', 'Area', 'Status']],
      body: this.filteredMembers.map(member => [
        member.firstName,
        member.lastName,
        member.mobile,
        member.email,
        member.area,
        member.status
      ]),
      startY: 20
    });

    // Save the PDF
    doc.save('members_export_' + new Date().getTime() + '.pdf');
  }
}
