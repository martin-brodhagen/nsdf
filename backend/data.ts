import { Discussion, Member, Thread, Post, Role, displayed_name_assignment } from "common/classes.ts";


const discussion_id = await lazyEternalVar("discussion_id") ?? $$(0)
const thread_id = await lazyEternalVar("thread_id") ?? $$(0)
const post_id = await lazyEternalVar("post_id") ?? $$(0)
const member_id = await lazyEternalVar("member_id") ?? $$(0)

export const all_topics: string[] = ["Letzte Generation", "Platzdeckchen-Häkel-Club"]
export const all_discussions = await lazyEternalVar("all_discussions") ?? $$(new Array<Discussion>)
export const all_members = await lazyEternalVar("all_members") ?? $$(new Array<Member>)

const all_threads = await lazyEternalVar("all_threads") ?? $$(new Array<Thread>)
const all_posts = await lazyEternalVar("all_posts") ?? $$(new Array<Post>)


// ------------------- Discussions -------------------
export function add_new_discussion(title: string, author: string, intro_arg: string, makeUB: boolean) {
    const discussion = new Discussion()
    discussion.author = author
    discussion._id = discussion_id.val++
    discussion.title = title
    discussion.intro_argument = intro_arg
    discussion.isUB = makeUB
    all_discussions.push(discussion)
    console.log("discussion added...")
}

export function delete_discussion(discussion: Discussion) {
    all_discussions[discussion._id].deleted = true
    console.log("deleted Discussion " + discussion._id)
}

export function expand_this_discussion(discussion: Discussion) {
}

// ------------------- Threads -------------------
export function start_new_thread(discussion: Discussion, author: string, text: string) {

    const thread = new Thread()
    thread._id = thread_id.val++
    thread.discussion_id = discussion._id

    const first = new Post()
    first.author = author
    first._id = post_id.val++
    first.discussion_id = thread.discussion_id
    first.thread_id = thread._id
    first.content = text
    first.time = new Date()

    thread.posts.push(first)
    all_posts.push(first)

    discussion.threads.push(thread)
    all_threads.push(thread)

    console.log("new thread created...")
}

export function delete_thread(thread: Thread) {
    all_threads[thread._id].deleted = true   
    console.log("deleted Thread " + thread._id)
}

// ------------------- Replies -------------------
export function add_new_reply(thread: Thread, text: string, author: string) {
    const reply = new Post()
    reply.author = author
    reply._id = post_id.val++
    reply.discussion_id = thread.discussion_id
    reply.thread_id = thread._id
    reply.content = text
    reply.time = new Date()

    thread.posts.push(reply)
    all_posts.push(reply)

    console.log("Reply posted...")
}

export function delete_reply(post: Post) {    
    
    all_posts[post._id].deleted = true
    console.log("deleted Post " + post._id)
}

export function edit_reply(post: Post, new_text: string) {

    all_posts[post._id].content = new_text
    console.log("edit successful")
}

// ------------------- members -------------------

export function add_new_member(name: string, age: number, role: Role) {
    const member = new Member()
    member._id = member_id.val++
    member.displayed_names = new Array<displayed_name_assignment>
    member.name = name
    member.age = age
    member.role = role

    all_members.push(member)
}

