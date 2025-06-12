import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBookingEvent } from './user-booking-event';

describe('UserBookingEvent', () => {
  let component: UserBookingEvent;
  let fixture: ComponentFixture<UserBookingEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBookingEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserBookingEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
