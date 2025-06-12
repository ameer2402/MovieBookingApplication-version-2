import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddEvent } from './admin-add-event';

describe('AdminAddEvent', () => {
  let component: AdminAddEvent;
  let fixture: ComponentFixture<AdminAddEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
