import { Component } from "uix/components/Component.ts";
import { PostComponent } from "./PostComponent.tsx";
import { Post } from "../backend/classes.ts";
import { new_reply_value, reply_author, add_new_reply, remove_reply } from "../backend/data.ts";

interface Props {
    _id: number,
    posts: Post[]
}

@template<Props>((props) =>
    <div>
        {props.$.posts.$.map((post: Post) => <PostComponent {...post} />)}

        <div>
            <input type="text" id="new-reply" value={new_reply_value} />
            <input type="text" id="reply-author" value={reply_author} />
            <button onclick={() => add_new_reply(props.$.posts)}>reply</button>
            <button onclick={() => remove_reply(props.$.posts)}>delete last reply</button>
        </div>

    </div>
)


export class ThreadComponent extends Component<Props> { }