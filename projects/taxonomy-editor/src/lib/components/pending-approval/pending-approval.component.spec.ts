import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PendingApprovalComponent } from './pending-approval.component';

describe('PendingApprovalComponent', () => {
  let component: PendingApprovalComponent;
  let fixture: ComponentFixture<PendingApprovalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
