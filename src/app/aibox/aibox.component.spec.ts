import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiboxComponent } from './aibox.component';

describe('AiboxComponent', () => {
  let component: AiboxComponent;
  let fixture: ComponentFixture<AiboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiboxComponent]
    });
    fixture = TestBed.createComponent(AiboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
