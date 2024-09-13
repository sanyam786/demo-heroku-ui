import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements  OnInit{

  memberId: string = '';
  afterSaveOrUpdate: any = false;

  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.memberId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.afterSaveOrUpdate = this.activatedRoute.snapshot.paramMap.get('afterSaveOrUpdate')!;
  }

}
