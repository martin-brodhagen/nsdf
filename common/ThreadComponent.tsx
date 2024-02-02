import { Component } from "uix/components/Component.ts";
import { PostComponent } from "common/PostComponent.tsx";
import { Post, PostStatus, Role } from "common/classes.ts";
import { add_new_reply, delete_thread, get_user } from "backend/data.ts";
import { Datex } from "unyt_core/datex.ts";

interface Props {
    _id: number,
    posts: Post[],
    deleted: boolean
}

@template<Props>(async (props) => {

    const reply_text = $$("")
    const alias = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Gast")
    const user = await get_user(alias.val)

    const showThread = $$(false)

    const isMoreThanOne = always(() => {
        if (user.role == Role.Mod || user.role == Role.Admin) {
            return props.posts.length > 1
        } else return props.posts.filter(post => post.status != PostStatus.Deleted).length > 1
    })

    const showThreadAction = always(() => {
        return (showThread.val || !isMoreThanOne.val)
    })

    const toggle_button_text = always(() => {
        return showThread.val ? "Read less" : "Read more"
    })
    
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            do_reply();
        }
    }
    
    
    function do_reply() {
        add_new_reply(props, reply_text.val, user.datex_alias)
        reply_text.val = ""
        showThread.val = true
        isMoreThanOne.val = true
    }

    const delete_button = () => {
        if (user.role == Role.Mod || user.role == Role.Admin) {
            return <button onclick={() => delete_thread(props)}>delete Thread {props._id}</button>
        } else {
            return <div></div>
        }
    }

    const thread_action = () => {
        if (user.role == Role.User || user.role == Role.Admin) {
            return <div id="thread-action" class={{ visible: showThreadAction }}>
                <input type="text" id="new-reply" placeholder="reply" onkeypress={handleKeyPress} value={reply_text} />
                <button onclick={do_reply}>reply</button>
            </div>
        } else {
            return <div></div>
        }
    }

    if (props.deleted) {
        return <li class="thread-container">
            <i>Thread deleted...</i>
        </li>
    }

    return <li class="thread-container">
        {always(delete_button)}
        <div class="post-container">
            {always(() => <PostComponent {...props.posts[0]} />)}
            <div id="post-wrapper" class={{ visible: showThread }}>
                {always(() => props.posts.slice(1).map((post: Post) => <PostComponent {...post} />))}
            </div>
        </div>
        {always(thread_action)}
        <button id="showThreadBtn" class={{ visible: isMoreThanOne }}
            onclick={() => {
                showThread.val = !showThread.val
            }}>{toggle_button_text}</button>
    </li>

})
export class ThreadComponent extends Component<Props> { }