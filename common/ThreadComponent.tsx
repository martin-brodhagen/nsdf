import { Component } from "uix/components/Component.ts";
import { PostComponent } from "common/PostComponent.tsx";
import { Post } from "common/classes.ts";
import { add_new_reply, remove_reply } from "backend/data.ts";

interface Props {
    _id: number,
    posts: Post[]
}

@template<Props>((props) => {
    const reply_text = $$("")
    const author = $$("Mark Replier")
    const showThread = $$(false)
    const show_first_post = $$(true)

    const toggle_button_text = always(() => {
        return show_first_post.val ? "ausklappen" : "einklappen"
    })

    const first_post: Post = props.posts[0]

    return <div class="thread-container">
        <button onclick={() => {
            showThread.val = !showThread.val
            show_first_post.val = !show_first_post.val
        }}>{toggle_button_text}</button>

        <div id="first-post-container" class={{ visible: show_first_post }}>
            {<PostComponent {...first_post} />}
        </div>

        <div id="post-container" class={{ visible: showThread }}>
            {props.$.posts.$.map((post: Post) => <PostComponent {...post} />)}
            <div>
                <input type="text" id="new-reply" placeholder="reply" value={reply_text} />
                <button onclick={() => {
                    add_new_reply(props.$.posts, reply_text.val, author.val)
                    reply_text.val = ""
                }}>reply</button>
                <button onclick={() => remove_reply(props.$.posts)}>delete last reply</button>
            </div>
        </div>




    </div>
})
export class ThreadComponent extends Component<Props> { }