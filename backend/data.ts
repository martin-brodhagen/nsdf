import { Discussion, User, Thread, Post, Role, } from "common/classes.ts";


const discussion_id = await lazyEternalVar("discussion_id") ?? $$(0)
const thread_id = await lazyEternalVar("thread_id") ?? $$(0)
const post_id = await lazyEternalVar("post_id") ?? $$(0)
const member_id = await lazyEternalVar("member_id") ?? $$(0)

export const all_topics: string[] = ["Letzte Generation", "Platzdeckchen-Häkel-Club"]
export const all_discussions = await lazyEternalVar("all_discussions") ?? $$(new Array<Discussion>)
export const all_members = await lazyEternalVar("all_members") ?? $$(new Array<User>)

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
    console.log("discussion added... by " + discussion.author)
}

export function delete_discussion(discussion: Discussion) {
    all_discussions[discussion._id].deleted = true
    console.log("deleted Discussion " + discussion._id)
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
    all_posts[post._id].edited = true
    console.log("edited post " + post._id)
}

// ------------------- users -------------------

const gast = $$(new User()) 
gast._id = -1
gast.datex_alias = "Gast"
gast.name = "Gast"
gast.role = Role.Guest

const martin = $$(new User())
martin._id = 0
martin.datex_alias = "@@8477F3B70E000000004055A6DC033D44.localhost_40701"
martin.name = "MARTIN!!!"
martin.role = Role.Admin

all_members[0] = gast
all_members[1] = martin

const colors = ["red", "blue", "green", "yellow", "purple", "teal", "brown", "orange"]
const animals = ["rhino", "elephant", "cat", "dog", "wolf", "tiger", "eagle", "hawk", "shark", "orca", "panda", "coyote", "snail", "crab"]

function random_name() {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const animal = animals[Math.floor(Math.random() * animals.length)]

    return color + " " + animal
}

export function add_new_user(datex_alias: string, role: Role) {
    const member = new User()
    member._id = member_id.val++
    member.displayed_names = new Array<string>
    member.datex_alias = datex_alias
    member.role = role

    all_members.push(member)
}

export function assign_display_name(member_id: number, discussion_id: number) {
    let name = random_name()

    while (name in all_discussions[discussion_id].pseudonyms) {
        name = random_name()
    }
    all_members[member_id].displayed_names[discussion_id] = name    
}

export function get_username(alias: string) {
    return all_members.find((member: User) => member.datex_alias == alias)?.name ?? gast.name
}

export function get_user_role(alias: string) {
    return all_members.find((member: User) => member.datex_alias == alias)?.role ?? Role.Guest   
}
