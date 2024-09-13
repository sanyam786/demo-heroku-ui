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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, AfterViewInit{

  @Input()
  afterSaveOrUpdate!: any;
  @Input() memberIdAfterSaveOrUpdate!: string;
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
    private router: Router
  ) {}

  ngOnInit(): void{
    if(this.afterSaveOrUpdate && this.afterSaveOrUpdate !== "false"){
      this.searchAfterSaveOrUpdate();
    }else{
      this.onSearch();
    }
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearch() {
    this.isLoading = true;  // Show progress bar
    this.familyMemberService.getAll().subscribe({
      next: (data) => {
        this.members = data;
        if(this.members !== undefined){
        this.dataSource = new MatTableDataSource(this.members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
        this.dataSource = new MatTableDataSource(this.members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
}