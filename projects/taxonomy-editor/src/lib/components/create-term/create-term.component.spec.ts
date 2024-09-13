import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTermComponent } from './create-term.component';

describe('CreateTermComponent', () => {
  let component: CreateTermComponent;
  let fixture: ComponentFixture<CreateTermComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTermComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTermComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
