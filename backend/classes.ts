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
}

export @sync class Thread {
    @property _id = -1
    @property title = ""
    @property posts: Post[] = []
}

export @sync class Post {
    @property _id = -1
    @property isUB = false
    @property author = ""
    @property content = ""
    @property time!: Date
}

export @sync class User {
    @property name!: string
    @property age!: number
}