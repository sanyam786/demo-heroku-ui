import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateMemberComponent } from './create-update-member.component';

describe('CreateUpdateMemberComponent', () => {
  let component: CreateUpdateMemberComponent;
  let fixture: ComponentFixture<CreateUpdateMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateUpdateMemberComponent]
    });
    fixture = TestBed.createComponent(CreateUpdateMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
