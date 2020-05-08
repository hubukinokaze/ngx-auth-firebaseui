import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.dialog.html',
  styleUrls: ['./edit.dialog.scss']
})
export class EditDialog {
  public formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  constructor(public dialogRef: MatDialogRef<EditDialog>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    }

  getErrorMessage() {
    return this.formControl.hasError('required') ? this.translate.instant('console.required') :
      this.formControl.hasError('email') ? this.translate.instant('console.invalidEmail') :
        '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    delete this.data.chapters;
    delete this.data.userURL;
    this.data.content = this.data.content.trim();
    this.data.source = this.data.source.trim();
    this.dialogRef.close(this.data);
  }

}
