import { Discussion, Member, Thread, Post, Role, displayed_name_assignment } from "common/classes.ts";


let discussion_id = 0
let post_id = 0
let thread_id = 0
let member_id = 0

export const all_topics: string[] = ["Letzte Generation", "Platzdeckchen-Häkel-Club"]
export const all_discussions = await lazyEternalVar("all_discussions") ?? $$(new Array<Discussion>)
export const all_members = await lazyEternalVar("all_members") ?? $$(new Array<Member>)


// ------------------- Discussions -------------------
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
    console.log("discussion added...")
}

// ------------------- Threads -------------------
export function start_new_thread(threads: Thread[], author: string, text: string) {
    const thread = new Thread()
    thread._id = thread_id++
    const first = new Post()
    first._id = post_id++
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

// ------------------- Replies -------------------
export function add_new_reply(posts: Post[], text: string, author: string) {
    const reply = new Post()
    reply.author = author
    reply._id = post_id++
    reply.content = text
    reply.time = new Date()
    posts.push(reply)
    console.log("Reply posted...")
}

export function remove_reply(posts: Post[]) {
    posts.pop()
}

// ------------------- NSDF'ers -------------------

export function add_new_member(name: string, age: number, role: Role) {
    const member = new Member()
    member._id = member_id++
    member.displayed_names = new Array<displayed_name_assignment>
    member.name = name
    member.age = age
    member.role = role

    all_members.push(member)
}

