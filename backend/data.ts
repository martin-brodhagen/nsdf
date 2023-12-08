import { Discussion, Thread, Post } from "common/classes.ts";

/**
 * Version information on the backend
 */

export const all_topics: string[] = ["Letzte Generation", "Platzdeckchen-Häkel-Club"]

let discussion_id = 0

export const all_discussions = await lazyEternalVar("all_discussions") ?? $$(new Array<Discussion>)

export function add_new_discussion(title: string, author: string, intro_arg: string, makeUB: boolean) {
    const discussion = new Discussion()
    discussion.author = author
    discussion._id = discussion_id++
    discussion.title = title
    discussion.intro_argument = intro_arg
    if(makeUB == true){
        discussion.isUB = true
    }
    all_discussions.push(discussion)
    console.log("discussion added" + discussion.title + " from " + title)
}

let id = 0;

export function add_new_reply(posts: Post[], text: string, author: string) {
    const reply = new Post()
    reply.author = author
    reply._id = id++
    reply.content = text
    reply.time = new Date()
    posts.push(reply)
    console.log("Reply posted...")
}

export function start_new_thread(threads: Thread[], author: string, text: string) {
    const thread = new Thread()
    thread._id = id++
    const first = new Post()
    first._id = 0
    first.author = author
    first.isUB = false
    first.content = text
    first.time = new Date()
    thread.posts.push(first)
    threads.push(thread)
    console.log("new thread created...")
}

export function remove_a_thread(threads: Thread[]) {
    threads.pop()
}

export function remove_reply(posts: Post[]) {
    posts.pop()
}

