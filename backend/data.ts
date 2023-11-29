import { Discussion, Thread, Post } from "backend/classes.ts";

/**
 * Version information on the backend
 */

export const all_topics: string[] = ["Letzte Generation", "Platzdeckchen-Häkel-Club"]

let discussion_id = 0

export const new_reply_value = $$("comment")
export const reply_author = $$("author")

export const all_discussions = await lazyEternalVar("all_discussions") ?? $$(new Array<Discussion>)

export function add_new_discussion() {
    const discussion = new Discussion()
    discussion.author = "martin"
    discussion._id = discussion_id++
    discussion.title = "awesome title"
    discussion.intro_argument = "I am, therefore I am right"
    all_discussions.push(discussion)
    console.log("discussion added")
}

let id = 0;

export function add_new_reply(posts: Post[]) {
    const reply = new Post()
    reply.author = reply_author
    reply._id = id++
    reply.content = new_reply_value
    reply.time = new Date()
    posts.push(reply)
    console.log("Reply posted...")
}

export function start_new_thread(threads: Thread[]) {
    const thread = new Thread()
    thread._id = id++
    const first = new Post()
    first._id = 0
    first.author = "mad max"
    first.isUB = false
    first.content = "this is the start of a new thread. beautiful..."
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