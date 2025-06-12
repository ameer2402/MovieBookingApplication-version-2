import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewEvent } from './admin-view-event';

describe('AdminViewEvent', () => {
  let component: AdminViewEvent;
  let fixture: ComponentFixture<AdminViewEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminViewEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminViewEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
