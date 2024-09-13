import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TermCardComponent } from './term-card.component';

describe('TermCardComponent', () => {
  let component: TermCardComponent;
  let fixture: ComponentFixture<TermCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TermCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
