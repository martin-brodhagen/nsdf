import { Component } from "uix/components/Component.ts";
import { PostComponent } from "common/PostComponent.tsx";
import { Post } from "common/classes.ts";
import { add_new_reply, delete_thread } from "backend/data.ts";

interface Props {
    _id: number,
    posts: Post[],
    deleted: boolean
}

//Issue 1:
// thread action is shouldnt be visible when thread is not shown

@template<Props>((props) => {

    const reply_text = $$("")
    const author = $$("Mark Replier")
    const showThread = $$(false)

    const toggle_button_text = always(() => {
        return showThread.val ? "-" : "+"
    })

    if (props.deleted) {
        return <li class="thread-container">
            <i>Thread deleted...</i>
        </li>

    } else {
        return <li class="thread-container">
            <button onclick={() => {
                showThread.val = !showThread.val
            }}>{toggle_button_text}</button>
            <button onclick={() => delete_thread(props)}>delete Thread {props._id}</button>
            <div class="post-container">
                {always(() => <PostComponent {...props.posts[0]} />)}
                <div id="post-wrapper" class={{ visible: showThread }}>
                    {always(() => props.posts.slice(1).map((post: Post) => <PostComponent {...post} />))}
                </div>
            </div>
            <div id="thread-action" class={{ visible: showThread }}>
                <input type="text" id="new-reply" placeholder="reply" value={reply_text} />
                <button onclick={() => {
                    add_new_reply(props, reply_text.val, author.val)
                    reply_text.val = ""
                }}>reply</button>
            </div>
        </li>
    }
}
)
export class ThreadComponent extends Component<Props> { }