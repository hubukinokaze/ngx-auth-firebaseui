export class Reflection {
    id: string;
    carpChapter: string;
    content: string;
    episode: number;
    source: string;
    userId: string;
    userURL: string;
    displayName :string;
    created: Date;
    modified: Date;

    constructor(
        id: string,
        carpChapter: string,
        content: string,
        episode: number,
        source: string,
        userId: string,
        userURL: string,
        created: Date,
        modified: Date
    ) {
        this.id = id;
        this.carpChapter = carpChapter;
        this.content = content;
        this.episode = episode;
        this.source = source;
        this.userId = userId;
        this.userURL = userURL;
        this.created = created;
        this.modified = modified;
    }
}
