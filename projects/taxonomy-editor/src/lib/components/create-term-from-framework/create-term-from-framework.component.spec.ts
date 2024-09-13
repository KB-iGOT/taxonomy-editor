import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateTermFromFrameworkComponent } from './create-term-from-framework.component';

describe('CreateTermFromFrameworkComponent', () => {
  let component: CreateTermFromFrameworkComponent;
  let fixture: ComponentFixture<CreateTermFromFrameworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTermFromFrameworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTermFromFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
