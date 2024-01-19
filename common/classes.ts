/**
 * Our very own data classes
 */

export @sync class Discussion {
    @property _id = -1
    @property isUB = false
    @property author = ""
    @property title = ""
    @property intro_argument = ""
    @property tldr = "This is not the TLDR you're looking for..."
    @property pseudonyms = new Array<string>
    @property threads: Thread[] = []
    @property deleted = false
}

export @sync class Thread {
    @property _id = -1
    @property discussion_id = -1
    @property title = ""
    @property posts: Post[] = []
    @property deleted = false
}

export @sync class Post {
    @property _id = -1
    @property discussion_id = -1
    @property thread_id = -1
    @property isUB = false
    @property author = ""
    @property content = ""
    @property time!: Date
    @property deleted = false
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
    @property displayed_names = new Array<string>
    @property datex_alias = ""
    @property name = ""
    @property role = Role.None
}

