import { Datex } from "datex-core-legacy/datex.ts";
import { UIX } from "uix";
import { Discussion, Thread, Topic, Post } from "./classes.ts";

/**
 * Version information on the backend
 */

let discussion_id = 0

export const new_reply_value = $$("comment")
export const reply_author = $$("author")

export const denoVersion = Deno.version.deno;
export const datexVersion = Datex.Runtime.VERSION;
export const uixVersion = UIX.version;

export const test_topic = new Topic()
test_topic._id = 0
test_topic.name = "Allgemeines"

export const test_post = new Post()
test_post._id = 0
test_post.author = "martin"
test_post.content = "this is a post"

export const test_post2 = new Post()
test_post2._id = 1
test_post2.author = "martin"
test_post2.content = "this is the second post"

export const test_thread = new Thread()
test_thread._id = 0
test_thread.posts.push(test_post)
test_thread.posts.push(test_post2)


export const test_discussion = await lazyEternal ?? $$(new Discussion())
test_discussion._id = discussion_id++
test_discussion.author = "Martin"
test_discussion.title = "Test-Title"
test_discussion.intro_argument = "ahoy mateys, how about some general stuff"
test_discussion.facettes.push("allgemeines allgemeinwissen")
test_discussion.topics.push(test_topic)
test_discussion.threads.push(test_thread)


export const all_discussions: Discussion[] = []
all_discussions.push(test_discussion)

export function add_new_discussion() {
    const discussion = new Discussion()
    discussion.author = "Martin"
    discussion._id = discussion_id++
    discussion.intro_argument = "test intro argument"
    all_discussions.push(discussion)
}

export function add_new_reply(author: string, content: string) {
    const reply = new Post()
    reply.author = author
    reply._id = 20
    reply.content = content
    test_discussion.threads[0].posts.push(reply)
}

export function remove_replies() {
    test_discussion.threads[0].posts.pop()
}