import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDialog } from './add.dialog';

describe('AddDialog', () => {
  let component: AddDialog;
  let fixture: ComponentFixture<AddDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
