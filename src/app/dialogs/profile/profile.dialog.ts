import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.dialog.html',
  styleUrls: ['./profile.dialog.scss']
})
export class ProfileDialog {
  public primaryRoles: Array<string>;
  public secondaryRoles: Array<string>;
  public carpChapters: Array<string>;
  public maxChapters: number = 2;
  private maxChaptersReached: boolean = false;

  public formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  constructor(public dialogRef: MatDialogRef<ProfileDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.primaryRoles = [
        'Admin',
        'Boss',
        'Regional Leader',
        'President',
        'Member'
      ];

      this.secondaryRoles = [
        'GM'
      ];

      this.carpChapters = [
        'CSULA',
        'CSULB',
        'ECC',
        'UCI'
      ];

      if (!this.data.primaryRole || this.data.primaryRole == 'Member' || this.data.primaryRole == 'President') {
        this.maxChapters = 0;
      } else if (this.data.primaryRole == 'Admin' || this.data.primaryRole == 'Boss') {
        this.maxChapters = 99
      }

      if (this.data?.chapters?.length >this. maxChapters) {
        this.maxChaptersReached = true;
      }
  }

  public chaptersChanged(event) {
    if (event?.length > this.maxChapters) {
      this.maxChaptersReached = true;
    } else {
      this.maxChaptersReached = false;
    }
    console.log(event)
  }

  public disableChapter(carpChapter) {
    if (!this.data?.chapters?.includes(carpChapter) && this.maxChaptersReached) {
      return true;
    }
    return false;
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    // delete this.data.chapters;
    // this.data.content = this.data.content.trim();
    // this.data.source = this.data.source.trim();
    this.dialogRef.close(this.data);
  }

  public checkRole(role: string): boolean {
    const currentRole = this.data.primaryRole;

    if (currentRole == 'Admin') {
      return false;
    } else if (currentRole == 'Boss') {
      if (role == 'Admin') {
        return true;
      }
    } else if (currentRole == 'Regional Leader') {
      if (role == 'Admin' || role == 'Boss') {
        return true;
      }
    } else if (currentRole == 'President') {
      if (role == 'Admin' || role == 'Boss' || role == 'Regional Leader') {
        return true;
      }
    } else if (currentRole == 'Member' || !currentRole) {
      if (role == 'Member') {
        return false;
      } return true;
    }

    return false;
  }
}
