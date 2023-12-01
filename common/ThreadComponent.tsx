import { Component } from "uix/components/Component.ts";
import { PostComponent } from "common/PostComponent.tsx";
import { Post } from "backend/classes.ts";
import { add_new_reply, remove_reply } from "backend/data.ts";

interface Props {
    _id: number,
    posts: Post[]
}

@template<Props>((props) => {
    const reply_text = $$("")
    const author = $$("Mark Replier")

    return <div>
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
})
export class ThreadComponent extends Component<Props> { }