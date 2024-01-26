import { Discussion, User, Thread, Post, Role, } from "common/classes.ts";


const discussion_id = await lazyEternalVar("discussion_id") ?? $$(0)
const thread_id = await lazyEternalVar("thread_id") ?? $$(0)
const post_id = await lazyEternalVar("post_id") ?? $$(0)
const member_id = await lazyEternalVar("member_id") ?? $$(0)

export const all_topics: string[] = ["Letzte Generation", "Platzdeckchen-Häkel-Club"]
export const all_discussions = await lazyEternalVar("all_discussions") ?? $$(new Set<Discussion>)
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
    all_discussions.add(discussion)
    console.log("discussion added... by " + discussion.author)
}

export function delete_discussion(discussion: Discussion) {
    discussion.deleted = true
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

all_members[0] = gast

const colors = ["red", "blue", "green", "yellow", "purple", "teal", "brown", "orange"]
const animals = ["rhino", "elephant", "cat", "dog", "wolf", "tiger", "eagle", "hawk", "shark", "orca", "panda", "coyote", "snail", "crab"]

function random_name() {
    const color = colors[Math.floor(Math.random() * colors.length)]
    const animal = animals[Math.floor(Math.random() * animals.length)]

    return color + " " + animal
}

export async function add_new_user(username: string) {

    const endpoint = datex.meta.sender.main;
    const datex_alias = await endpoint.getAlias()
    const member = new User()
    member._id = member_id.val++
    member.displayed_names = new Array<string>
    member.endpoint = endpoint
    member.datex_alias = datex_alias!
    member.name = username
    member.role = Role.User
    
    all_members.push(member)
    console.log("Endpoint: " + endpoint + " - alias: " + datex_alias + "  " + username + " registered")
}

export function assign_display_name(member_id: number, discussion_id: number) {
    let name = random_name()

    const discussions_array = Array.from(all_discussions)

    while (name in discussions_array[discussion_id].pseudonyms) {
        name = random_name()
    }
    all_members[member_id].displayed_names[discussion_id] = name    
}

export function get_username(alias: string) {
    return all_members.find((member: User) => member.datex_alias == alias)?.name ?? "Neuer User"
}

export function get_user_role(alias: string) {
    return all_members.find((member: User) => member.datex_alias == alias)?.role ?? Role.Guest   
}

export function set_user_role(alias: string, role: Role) {
    all_members.find((member: User) => member.datex_alias == alias)!.role = role
}
