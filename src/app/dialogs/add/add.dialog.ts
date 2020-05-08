import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.dialog.html',
  styleUrls: ['./add.dialog.scss'],
})
export class AddDialog {
  public formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  constructor(public dialogRef: MatDialogRef<AddDialog>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if (data?.chapters && data?.chapters.length == 1) {
        data.carpChapter = data.chapters[0];
      }
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
    this.data.content = this.data.content.trim();
    this.data.source = this.data.source.trim();
    this.dialogRef.close(this.data);
  }

}
