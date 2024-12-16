import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveinfoComponent } from './executiveinfo.component';

describe('ExecutiveinfoComponent', () => {
  let component: ExecutiveinfoComponent;
  let fixture: ComponentFixture<ExecutiveinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExecutiveinfoComponent]
    });
    fixture = TestBed.createComponent(ExecutiveinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
