import {AfterViewInit, OnInit, Component, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Tutorial } from 'src/app/models/tutorial.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, AfterViewInit{
  searchQuery: string = '';
  tutorials?: Tutorial[];;
  firstName: string = '';
  lastName: string = '';
  mobile: string = '';
  fatherName: string = '';
  area: string = '';
  dataSource!: MatTableDataSource<Tutorial>;
  displayedColumns: string[] = ['title', 'description', 'officeAddress', 'published', 'actions'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(
    private tutorialService: TutorialService,
    private router: Router
  ) {}

  ngOnInit(): void{
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
    console.log("first name value :: "+this.firstName);
    console.log("first name value :: "+this.lastName);
    this.tutorialService.findByTitle(this.firstName).subscribe({
      next: (data) => {
        this.tutorials = data;
        if(this.tutorials !== undefined){
        for(let i=0; i<this.tutorials.length; i++){
          if(this.tutorials[i].published){
            this.tutorials[i].status = 'Approved';
          }else {
            this.tutorials[i].status = 'Pending';
          }          
        }
        this.dataSource = new MatTableDataSource(this.tutorials);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        }
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  onViewDetails(id: string) {
    // Navigate to the view component and pass the id
    this.router.navigate(['/view', id]);
  }
}