/**
 * Our very own data classes
 */

export @sync class Discussion {
    @property _id = -1
    @property isUB = false
    @property author = ""
    @property title = ""
    @property intro_argument = ""
    @property topics: Topic[] = []
    @property facettes: string[] = []
    @property tags: string[] = []
    @property threads: Thread[] = []
}

export @sync class Topic {
    @property _id = -1
    @property name = ""
}

export @sync class Thread {
    @property _id = -1
    @property posts: Post[] = []
}

export @sync class Post {
    @property _id = -1
    @property isUB = false
    @property author = ""
    @property content = ""
}

export @sync class User {
    @property name!: string
    @property age!: number
}