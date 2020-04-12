export class Reflection {
    id: string;
    carpChapter: string;
    content: string;
    episode: string;
    source: string;
    userId: string;
    userURL; string;
    displayName :string;

    constructor(
        id: string,
        carpChapter: string,
        content: string,
        episode: string,
        source: string,
        userId: string,
        userURL: string
    ) {
        this.id = id;
        this.carpChapter = carpChapter;
        this.content = content;
        this.episode = episode;
        this.source = source;
        this.userId = userId;
        this.userURL = userURL;
    }
}
