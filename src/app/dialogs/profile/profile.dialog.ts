import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.dialog.html',
  styleUrls: ['./profile.dialog.scss']
})
export class ProfileDialog {
  public primaryRoles: Array<any>;
  public secondaryRoles: Array<string>;
  public carpChapters: Array<string>;
  public displayNameInitials: string;
  public maxChapters: number = 2;
  private maxChaptersReached: boolean = false;

  public formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  constructor(public dialogRef: MatDialogRef<ProfileDialog>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.primaryRoles = [
      {
        label: this.translate.instant('role.member'),
        value: 'Member'
      },
      {
        label: this.translate.instant('role.president'),
        value: 'President'
      },
      {
        label: this.translate.instant('role.regionalLeader'),
        value: 'Regional Leader'
      },
      {
        label: this.translate.instant('role.boss'),
        value: 'Boss'
      },
      {
        label: this.translate.instant('role.admin'),
        value: 'Admin'
      }
    ];

    this.secondaryRoles = [
      'GM'
    ];

    this.carpChapters = [
      'CPP',
      'CSUF',
      'CSULA',
      'CSULB',
      'Cypress',
      'ECC',
      'ELAC',
      'PCC',
      'UCI',
      'UCLA'
    ];

    this.getMaxChapters();

    this.displayNameInitials = this.getDisplayNameInitials(this.data.displayName);
  }

  public getMaxChapters() {
    if (!this.data.primaryRole || this.data.primaryRole == 'Member' || this.data.primaryRole == 'President') {
      this.maxChapters = 0;
    } else if (this.data.primaryRole == 'Admin' || this.data.primaryRole == 'Boss') {
      this.maxChapters = 99;
    } else {
      this.maxChapters = 2;
    }

    if (this.data?.chapters?.length > this.maxChapters) {
      this.maxChaptersReached = true;
    }
  }

  public chaptersChanged(event) {
    if (event?.length > this.maxChapters) {
      this.maxChaptersReached = true;
    } else {
      this.maxChaptersReached = false;
    }
  }

  public disableChapter(carpChapter) {
    if (!this.data?.chapters?.includes(carpChapter) && this.maxChaptersReached) {
      return true;
    }
    return false;
  }

  private getDisplayNameInitials(displayName: string | null): string | null {
    if (!displayName) {
      return null;
    }
    const initialsRegExp: RegExpMatchArray = displayName.match(/\b\w/g) || [];
    const initials = ((initialsRegExp.shift() || '') + (initialsRegExp.pop() || '')).toUpperCase();
    return initials;
  }

  public onRoleChange(value) {
    if (["Member", "President"].includes(value) && this.data.chapters && this.data.chapters.length > 1) {
      this.data.chapters = this.data.chapters.splice(0, 1);
    } else if (value == "Regional Leader" && this.data.chapters && this.data.chapters.length > 3) {
      this.data.chapters = this.data.chapters.splice(0, 3);
    }
    this.getMaxChapters();
    this.chaptersChanged(this.data.chapters);
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
    // delete this.data.chapters;
    // this.data.content = this.data.content.trim();
    // this.data.source = this.data.source.trim();
    this.dialogRef.close(this.data);
  }

  public checkRole(role: string): boolean {
    const currentRole = this.data.primaryRole;
    const currentOtherUserRole = this.data?.otherUser?.primaryRole;

    if (!this.data?.isOtherUser) {
      if (currentRole == 'Admin') {
        return false;
      } else if (currentRole == 'Boss') {
        if (role == 'Admin') {
          return true;
        }
      } else if (currentRole == 'Regional Leader') {
        if (['Admin', 'Boss'].includes(role)) {
          return true;
        }
      } else if (currentRole == 'President') {
        if (['Admin', 'Boss', 'Regional Leader'].includes(role)) {
          return true;
        }
      } else if (currentRole == 'Member' || !currentRole) {
        if (role == 'Member') {
          return false;
        } return true;
      }
      return false;
    } else {
      if (currentOtherUserRole == 'Admin') {
        return false;
      } else if (currentOtherUserRole == 'Boss') {
        if (role == 'Admin') {
          return true;
        }
      } else if (currentOtherUserRole == 'Regional Leader') {
        if (['Admin', 'Boss'].includes(role)) {
          return true;
        }
      } else if (currentOtherUserRole == 'President') {
        if (['Admin', 'Boss', 'Regional Leader'].includes(role)) {
          return true;
        }
      }

      return false;
    }
  }
}
