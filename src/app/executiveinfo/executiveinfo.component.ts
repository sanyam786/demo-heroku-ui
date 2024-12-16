import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-executiveinfo',
  templateUrl: './executiveinfo.component.html',
  styleUrls: ['./executiveinfo.component.css']
})
export class ExecutiveinfoComponent implements OnInit {
  page: string = ''; // Holds the current page identifier

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the data passed via the route
    this.route.data.subscribe((data) => {
      this.page = data['page'];
    });
  }
}
