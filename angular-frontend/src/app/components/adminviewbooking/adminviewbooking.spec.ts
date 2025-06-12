import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adminviewbooking } from './adminviewbooking';

describe('Adminviewbooking', () => {
  let component: Adminviewbooking;
  let fixture: ComponentFixture<Adminviewbooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adminviewbooking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adminviewbooking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
