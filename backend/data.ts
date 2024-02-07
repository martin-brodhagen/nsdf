import { Discussion, User, Thread, Post, Role, PostStatus, } from "common/classes.ts";

const discussion_id = await lazyEternalVar("discussion_id") ?? $$(0)
const thread_id = await lazyEternalVar("thread_id") ?? $$(0)
const post_id = await lazyEternalVar("post_id") ?? $$(0)
const member_id = await lazyEternalVar("member_id") ?? $$(1)

export const all_discussions = await lazyEternalVar("all_discussions") ?? $$(new Array<Discussion>)
export const all_members = await lazyEternalVar("all_members") ?? $$(new Array<User>)

const all_threads = await lazyEternalVar("all_threads") ?? $$(new Array<Thread>)
const all_posts = await lazyEternalVar("all_posts") ?? $$(new Array<Post>)
export const possible_ub_posts = await lazyEternalVar("possible_ub_posts") ?? $$(new Set<Post>)


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

    all_members.forEach((user: User) => assign_pseudonym_for_discussion(user, discussion))
}

export function delete_discussion(discussion: Discussion) {
    discussion.deleted = true
    console.log("deleted Discussion " + discussion._id)
}

// ------------------- Threads -------------------
function create_post(author: string, text: string) {
    const post = new Post()
    post.author = author
    post._id = post_id.val++
    post.content = text
    post.time = new Date()
    return post
}

function isUserUbInDiscussion(user: User, discussion_id: number) {
    return user.ub_for_discussion_index[discussion_id] === true
}

export function start_new_thread(discussion: Discussion, user: User, text: string) {

    const thread = new Thread()
    thread._id = thread_id.val++
    thread.discussion_id = discussion._id

    const first = create_post(user.endpoint, text)
    first.discussion_id = thread.discussion_id
    first.thread_id = thread._id

    if(isUserUbInDiscussion(user, discussion._id)) first.status = PostStatus.UB

    thread.posts.push(first)
    all_posts.push(first)

    user.posts.push(first)

    discussion.threads.push(thread)
    all_threads.push(thread)

    console.log("new thread created...")
}

export function delete_thread(thread: Thread) {
    all_threads[thread._id].deleted = true
    console.log("deleted Thread " + thread._id)
}

// ------------------- Replies -------------------
export function add_new_reply(thread: Thread, text: string, user: User) {
    const reply = create_post(user.endpoint, text)
    reply.discussion_id = thread.discussion_id
    reply.thread_id = thread._id

    if(isUserUbInDiscussion(user, reply.discussion_id)) reply.status = PostStatus.UB

    thread.posts.push(reply)
    all_posts.push(reply)

    user.posts.push(reply)

    console.log(reply.author + " postet a new reply...")
}

export function delete_reply(post: Post) {    
    
    all_posts[post._id].status = PostStatus.Deleted
    possible_ub_posts.delete(post)
    console.log("deleted Post " + post._id)
}

export function edit_reply(post: Post, new_text: string) {
    all_posts[post._id].content = new_text
    all_posts[post._id].edited = true
    console.log("edited post " + post._id)
}


// ------------------- ub -------------------

export function add_to_possible_ub(post: Post) {
    if (all_posts[post._id].status == PostStatus.NotSet) {
        possible_ub_posts.add(post)
        console.log("added to possible ub list" + post._id)
    } else {
        console.log("post " + post._id + " had already been reported and processed.")
    }
}

export function set_post_ub(post: Post) {
    all_posts[post._id].status = PostStatus.UB
    possible_ub_posts.delete(post)
    get_user(post.author).ub_for_discussion_index[post.discussion_id] = true
    console.log("Post " + post._id + " now ub")
}

export function verify(post: Post) {
    all_posts[post._id].status = PostStatus.Verified
    possible_ub_posts.delete(post)
    console.log("Post " + post._id + " now verified")
}


// ------------------- users -------------------

const gast = $$(new User()) 
gast._id = 0
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
    member.pseudonyms = new Array<string>
    member.endpoint = endpoint.toString()
    member.name = username
    member.role = Role.User
    
    all_discussions.forEach((discussion: Discussion) => assign_pseudonym_for_discussion(member, discussion))

    all_members.push(member)
    console.log("Endpoint: " + endpoint + " - alias: " + datex_alias + "  " + username + " registered")
}

export function assign_pseudonym_for_discussion(user: User, discussion: Discussion) {

    let name = random_name()

    while (discussion.pseudonyms.includes(name)) {
        name = random_name()
    }
    discussion.pseudonyms.push(name)
    user.pseudonyms[discussion._id] = name    
}

export function get_user(endpoint: string) {
    return all_members.find((member: User) => member.endpoint == endpoint) ?? gast
}
