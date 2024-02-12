/**
 * Our very own data classes
 */

export @sync class Discussion {
    @property _id = -1
    @property isUB = false
    @property author = ""
    @property title = ""
    @property intro_argument = ""
    @property tldr = ""
    @property pseudonyms = new Array<string>
    @property threads: Thread[] = []
    @property deleted = false
    @property num_posts = 0
}


export @sync class Thread {
    @property _id = -1
    @property discussion_id = -1
    @property title = ""
    @property posts: Post[] = []
    @property deleted = false
}

export enum PostStatus {
    NotSet,
    UB,
    Verified,
    Deleted
}

export @sync class Post {
    @property _id = -1
    @property discussion_id = -1
    @property thread_id = -1
    @property author = ""
    @property content = ""
    @property time!: Date
    @property edited = false
    @property status = PostStatus.NotSet
}

export enum Role {
    None,
    User,
    Admin,
    Guest,
    Mod
}

export @sync class User {
    @property _id = -1
    @property pseudonyms = new Array<string>
    @property ub_for_discussion_index = new Array<boolean>
    @property endpoint = ""
    @property name = ""
    @property role = Role.None
    @property posts = new Array<Post>
    @property participated_discussions = new Set<Discussion>
}
