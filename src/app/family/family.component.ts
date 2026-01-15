import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent {

  constructor(
    //private tutorialService: TutorialService,
    private router: Router
  ) {}

  onAddNewMember(memberId: string) {
    // Navigate to the view component and pass the id
    this.router.navigate(['/create-update-member', {id: memberId, pageMode: 'create', pageFrom: 'existingUser'}]);
  }
}
