import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDirective } from './login.directive';

describe('LoginDirective', () => {
  let directive: LoginDirective;
  let fixture: ComponentFixture<LoginDirective>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDirective);
    directive = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });
});
