import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit  {
  title = 'Sadhumargi Jain Sangh';
  images = [
    'assets/banner1.jpeg',
    'assets/banner2.jpeg',
    'assets/banner3.jpeg',
    'assets/banner4.jpeg'
  ];

  currentIndex = 0;
  intervalId: any;


  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  ngOnInit(): void {
    // Start automatic image sliding
    this.startAutoSlide();
  }

  constructor(private router: Router
  ) {
  }

  ngOnDestroy() {
    // Clear interval when component is destroyed
    clearInterval(this.intervalId);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 3000); // Change slide every 5 seconds
  }

  viewSBMInfo(){
    this.router.navigate(['/sbminfo']);
  }
}
