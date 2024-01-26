/**
 * Our very own data classes
 */

import { Endpoint, datexClass, datexClassType } from "unyt_core/datex_all.ts";

@sync class _Discussion {
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

export const Discussion = datexClass(_Discussion)
export type Discussion = datexClassType<typeof _Discussion>

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
    @property edited = false
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
    @property displayed_names = new Array<string>
    @property endpoint = new Endpoint("", "")
    @property datex_alias = ""
    @property name = ""
    @property role = Role.None
}

export const User = datexClass(_User)
export type User = datexClassType<typeof _User>
