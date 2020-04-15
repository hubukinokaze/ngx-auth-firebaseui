export class User {
    uid: string;
    id: string;
    displayName: string;
    email: string;
    chapters: Array<string>;
    primaryRole: string;
    secondaryRole: string;
    darkMode: boolean;
    photoURL: string;
    created: Date;
    modified: Date;

    constructor(
        id: string,
        displayName: string,
        email: string,
        chapters: Array<string>,
        primaryRole: string,
        secondaryRole: string
    ) {
        this.id = id;
        this.displayName = displayName;
        this.email = email;
        this.chapters = chapters;
        this.primaryRole = primaryRole;
        this.secondaryRole = secondaryRole;
    }
}
