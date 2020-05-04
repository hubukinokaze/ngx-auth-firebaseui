import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.dialog.html',
  styleUrls: ['./confirmation.dialog.scss']
})
export class ConfirmationDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  submit() {
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
