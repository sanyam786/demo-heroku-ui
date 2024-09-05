import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Tutorial } from 'src/app/models/tutorial.model';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  id!: string;
  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    officeAddress: '',
    published: false
  };

  constructor(
    private route: ActivatedRoute,
    private tutorialService: TutorialService
  ) {}

  ngOnInit(): void {
    // Retrieve the id from the route parameters
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadData(this.id); // Call a method to load data based on the id
  }

  loadData(id: string): void {
    this.tutorialService.get(id).subscribe({
      next: (data) => {
        this.currentTutorial = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
}
