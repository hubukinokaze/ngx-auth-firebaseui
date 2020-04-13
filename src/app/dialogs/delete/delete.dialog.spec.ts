import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDialog } from './delete.dialog';

describe('Delete.DialogComponent', () => {
  let component: DeleteDialog;
  let fixture: ComponentFixture<DeleteDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
