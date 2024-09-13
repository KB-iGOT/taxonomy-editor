import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateCategoriesComponent } from './create-categories.component';

describe('CreateCategoriesComponent', () => {
  let component: CreateCategoriesComponent;
  let fixture: ComponentFixture<CreateCategoriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
