import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewEvent } from './user-view-event';

describe('UserViewEvent', () => {
  let component: UserViewEvent;
  let fixture: ComponentFixture<UserViewEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserViewEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserViewEvent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
