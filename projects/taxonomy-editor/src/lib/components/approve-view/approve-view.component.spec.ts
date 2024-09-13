import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApproveViewComponent } from './approve-view.component';

describe('ApproveViewComponent', () => {
  let component: ApproveViewComponent;
  let fixture: ComponentFixture<ApproveViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
