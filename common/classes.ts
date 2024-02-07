/**
 * Our very own data classes
 */

import { datexClass, datexClassType } from "unyt_core/datex_all.ts";

@sync class _Discussion {
    @property _id = -1
    @property isUB = false
    @property author = ""
    @property title = ""
    @property intro_argument = ""
    @property tldr = ""
    @property pseudonyms = new Array<string>
    @property threads: Thread[] = []
    @property deleted = false
}

export const Discussion = datexClass(_Discussion)
export type Discussion = datexClassType<typeof _Discussion>

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

@sync class _User {
    @property _id = -1
    @property pseudonyms = new Array<string>
    @property ub_for_discussion_index = new Array<boolean>
    @property endpoint = ""
    @property name = ""
    @property role = Role.None
    @property posts = new Array<Post>
}

export const User = datexClass(_User)
export type User = datexClassType<typeof _User>
