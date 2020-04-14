import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDialog } from './profile.dialog';

describe('ProfileDialog', () => {
  let component: ProfileDialog;
  let fixture: ComponentFixture<ProfileDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
