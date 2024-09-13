import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConforamtionPopupComponent } from './conforamtion-popup.component';

describe('ConforamtionPopupComponent', () => {
  let component: ConforamtionPopupComponent;
  let fixture: ComponentFixture<ConforamtionPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConforamtionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConforamtionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
