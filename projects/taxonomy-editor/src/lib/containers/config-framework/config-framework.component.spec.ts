import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfigFrameworkComponent } from './config-framework.component';

describe('ConfigFrameworkComponent', () => {
  let component: ConfigFrameworkComponent;
  let fixture: ComponentFixture<ConfigFrameworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigFrameworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigFrameworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
