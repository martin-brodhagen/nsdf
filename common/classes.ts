/**
 * Our very own data classes
 */

export @sync class Discussion {
    @property _id = -1
    @property isUB = false
    @property author = ""
    @property title = ""
    @property intro_argument = ""
    @property facettes: string[] = []
    @property tags: string[] = []
    @property threads: Thread[] = []
    @property minimized = false
    @property deleted = false
}

export @sync class Thread {
    @property _id = -1
    @property discussion_id = -1
    @property title = ""
    @property posts: Post[] = []
    @property minimized = false
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
    @property minimized = false
    @property deleted = false
}

export enum Role {
    None = "None",
    User = "User",
    Mod = "Mod",
    Guest = "Guest",
    Admin = "Admin"
}

export @sync class displayed_name_assignment {
    @property discussion_id = -1
    @property displayed_name = "not yet assigned"
}

export @sync class Member {
    @property _id = -1
    @property displayed_names = new Array<displayed_name_assignment>
    @property name!: string
    @property age!: number
    @property role = Role.None
}

