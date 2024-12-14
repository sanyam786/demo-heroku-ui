import { Component, Input } from '@angular/core';
import { FamilyMemberService } from '../services/familyMember.service';

@Component({
  selector: 'app-aibox',
  templateUrl: './aibox.component.html',
  styleUrls: ['./aibox.component.css']
})
export class AiboxComponent {
  @Input() memberId: any;
  analysisResult: string = '';

  constructor(private memberService: FamilyMemberService) {}

  ngOnInit(): void {
    //const memberId = 1;  // Example member ID
    this.memberService.getMemberAnalysis(this.memberId).subscribe((response) => {
      this.analysisResult = response;
    });
  }
}
