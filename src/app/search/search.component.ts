import {AfterViewInit, OnInit, Component, ViewChild, ChangeDetectionStrategy, Input} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TutorialService } from 'src/app/services/tutorial.service';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import { Member } from 'src/app/models/Member.model';
import { Router } from '@angular/router';
import { FamilyMember } from '../models/FamilyMember.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SearchComponent implements OnInit, AfterViewInit{

  @Input()
  afterSaveOrUpdate!: any;
  @Input() memberIdAfterSaveOrUpdate!: string;
  searchQuery: string = '';
  members?: Member[];
  member?: Member;
  pageMode: string = '';
  //dataSource!: MatTableDataSource<Member>;
  //displayedColumns: string[] = ['actions', 'firstName', 'fatherName', 'mobile', 'area', 'profession', 'bloodGroup', 'status'];
  isLoading = true;  // Track the loading state
  filteredMembers: Member[] = [];
  visibleMembers: Member[] = [];  // Members to display
  limit = 10;  // Number of items to load initially
  offset = 0;  // Track how many items have been loaded
  searchValue = '';  // Current search filter value
  loggedInRole = '';
  loggedInMemberId = 0;
  //@ViewChild(MatPaginator)
  //paginator!: MatPaginator;
  //@ViewChild(MatSort)
  //sort!: MatSort;
  constructor(
    private familyMemberService: FamilyMemberService,
    private router: Router
  ) {}

  ngOnInit(): void{
    this.loggedInRole = this.familyMemberService.getLoggedInRole();
    this.loggedInMemberId = this.familyMemberService.getLoggedInMemberId();
    if(this.afterSaveOrUpdate && this.afterSaveOrUpdate !== "false"){
      this.searchAfterSaveOrUpdate();
    }else{
      this.onSearch();
    }
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    var filterValue = (event.target as HTMLInputElement).value;
    filterValue = filterValue.trim().toLowerCase();  // Remove whitespace and convert to lowercase for case-insensitive search
    this.searchValue = filterValue;
    if(this.members !== undefined){
      this.filteredMembers = this.members.filter(member =>
        member.firstName!.toLowerCase().includes(filterValue) ||
        member.lastName!.toLowerCase().includes(filterValue) ||
        member.mobile!.includes(filterValue) ||
        //member.dateOfBirth!.includes(filterValue) ||
        // member.memberId!.includes(filterValue) ||
        member.bloodGroup!.toLowerCase().includes(filterValue) ||
        //member.whatsappMobile!.includes(filterValue) ||
        member.area!.toLowerCase().includes(filterValue) ||
        member.status!.toLowerCase().includes(filterValue)
      );
    }
    // Reset visible members and offset for new search results
    this.visibleMembers = [];
    this.offset = 0;
    this.loadMoreMembers();
  }

  // Handle infinite scroll
  onScroll(event: any): void {
    const element = event.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      // Load more data when reaching the bottom
      this.loadMoreMembers();
    }
  }

  onSearch() {
    this.isLoading = true;  // Show progress bar
    this.familyMemberService.getAllFamiliesForDefaultSearch().subscribe({
      next: (data) => {
        this.members = data;
        if(this.members !== undefined){
          this.filteredMembers = this.members;  // Initially, show all members
          this.loadMoreMembers();  // Load the first batch of members
        //this.dataSource = new MatTableDataSource(this.members);
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
        this.isLoading = false;
        }
       // console.log(data);
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;  // Hide progress bar on error
      }
    });
  }

  searchAfterSaveOrUpdate() {
    this.isLoading = true;  // Show progress bar
    this.familyMemberService.getFamilyByMemberId(this.memberIdAfterSaveOrUpdate).subscribe({
      next: (data) => {
        this.members = data.members;
        if(this.members !== undefined){
          this.filteredMembers = this.members;  // Initially, show all members
          this.loadMoreMembers();  // Load the first batch of members
        // this.dataSource = new MatTableDataSource(this.members);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.isLoading = false;
        }
        //console.log(data);
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;  // Hide progress bar on error
      }
    });
  }

    // Load a batch of members from filteredMembers
    loadMoreMembers(): void {
      const newMembers = this.filteredMembers.slice(this.offset, this.offset + this.limit);
      this.visibleMembers = this.visibleMembers.concat(newMembers);
      this.offset += this.limit;
    }

  onViewDetails(id: string) {
    // Navigate to the view component and pass the id
    this.router.navigate(['/view', id]);
  }

  onAddNewFamily() {
    this.pageMode = 'create';
    // Navigate to the view component and pass the id
    this.router.navigate(['/create-update-member', {id: 0, pageMode: this.pageMode}]);
  }

  onAddNewMember(memberId: string) {
    this.pageMode = 'create';
    // Navigate to the view component and pass the id
    this.router.navigate(['/create-update-member', {id: memberId, pageMode: this.pageMode}]);
  }

  onEditMember(memberId: string) {
    this.pageMode = 'edit';
    // Navigate to the view component and pass the id
    this.router.navigate(['/create-update-member', {id: memberId, pageMode: this.pageMode}]);
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

  isSelfEdit(memberId: any): any {
    if(this.loggedInRole === 'selfedit' && memberId === this.loggedInMemberId){
      return true;
    }
    return false;
  }

  checkRoles(): any {
    if(this.loggedInRole === 'admin' ||  this.loggedInRole === 'edit'){
      return true;
    }
    return false;
  }
}