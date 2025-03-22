import { Component, Input, ElementRef, ViewChild, Injectable, HostListener, OnInit, OnDestroy } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ActivatedRoute, Router } from '@angular/router';
import { FamilyMemberService } from 'src/app/services/familyMember.service';
import { Member } from 'src/app/models/Member.model';

@Component({
  selector: 'app-id-card',
  templateUrl: './id-card.component.html',
  styleUrls: ['./id-card.component.css'],
  host: { '[class]': 'themeClass' } // this dynamically adds the theme class to :host
})
export class IdCardComponent {
  @ViewChild('card') cardRef!: ElementRef;
  member: any;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private familyMemberService: FamilyMemberService,
    //private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Retrieve the id from the route parameters
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.loadData(this.id); // Call a method to load data based on the id
  }
  downloadPDF() {
    html2canvas(this.cardRef.nativeElement, { scale: 3 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', [canvas.width / 3, canvas.height / 3]);
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
      pdf.save(`${this.member?.firstName || 'id'}-card.pdf`);
    });
  }

  loadData(id: string): void {
    //this.isLoading = true;  // Show progress bar
    this.familyMemberService.getMemberById(id).subscribe({
      next: (data) => {
        this.member = data;
        //this.isLoading = false;
        //console.log(data);
      },
      error: (e) => {
        console.error(e);
        //this.isLoading = false;  // Hide progress bar on error
      }
    });
  }

  themes = [
    { label: 'Original', value: 'original' },
    { label: 'Royal Blue', value: 'royal-blue' },
    { label: 'Indigo & Sky Blue', value: 'indigo-sky' },
    { label: 'Green & Cream', value: 'green-cream' },
    { label: 'Charcoal & Gold', value: 'charcoal-gold' },
    { label: 'Crimson & Ivory', value: 'crimson-ivory' },
    { label: 'Teal & Light Gray', value: 'teal-light-gray' },
    { label: 'Orange & Slate', value: 'orange-slate' },
    { label: 'Purple & Mint', value: 'purple-mint' },
    { label: 'Darkblue & Aqua', value: 'darkblue-aqua' },
    { label: 'Maroon & Sand', value: 'maroon-sand' },
    { label: 'Blush & Pink', value: 'blush-pink' },
    { label: 'Mint & Sage', value: 'mint-sage' },
    { label: 'Lavender & Lilac', value: 'lavender-lilac' },
    { label: 'Peach & Apricot', value: 'peach-apricot' },
    { label: 'Baby & Blue', value: 'baby-blue' },
    { label: 'Midnight Blue & Ice Gray', value: 'midnight-blue' },
    { label: 'Wine Red & Light Gray', value: 'wine-gray' },
    { label: 'Gunmetal & Silver', value: 'gunmetal-silver' },
    { label: 'Forest Green & Ash', value: 'forest-ash' },
    { label: 'Cocoa Brown & Beige', value: 'cocoa-beige' },
    { label: 'Obsidian & Steel Gray', value: 'obsidian-steel' },
    { label: 'Navy Blue & Ash Gray', value: 'navy-ash' },
    { label: 'Walnut Brown & Stone', value: 'walnut-stone' },
    { label: 'Eggplant & Pale Mauve', value: 'eggplant-mauve' },
    { label: 'Dark Olive & Clay', value: 'olive-clay' }
  ];

  selectedTheme = 'royal-blue';

  get themeClass() {
    return this.selectedTheme;
  }

  changeTheme(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedTheme = value;
  }
}