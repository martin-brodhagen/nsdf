import { Component } from "uix/components/Component.ts";
import { PostComponent } from "common/PostComponent.tsx";
import { Post, Thread, PostStatus, Role } from "common/classes.ts";
import { add_new_reply, delete_thread, get_user } from "backend/data.ts";
import { Datex } from "unyt_core/datex.ts";

interface Props {
    thread: Thread,
    avoid_ub: boolean
}

@template<Props>(async (props, { thread }) => {

    const endpoint = $$(await Datex.Runtime.endpoint.main)
    const user = await get_user(endpoint.toString())

    const reply_text = $$("")
    const showThread = $$(false)

    const isMoreThanOne = always(() => {
        if (user.role == Role.Mod || user.role == Role.Admin) {
            return thread.posts.length > 1
        } else return thread.posts.filter(post => post.status != PostStatus.Deleted).length > 1
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
        add_new_reply(thread, reply_text.val, user)
        reply_text.val = ""
        showThread.val = true
        isMoreThanOne.val = true
    }

    const delete_button = () => {
        if (user.role == Role.Admin) {
            return <button onclick={() => delete_thread(thread)}>delete Thread {thread._id}</button>
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

    const post_container = () => {
        return <div class="post-container">
            {always(() => <PostComponent post={thread.posts[0]} avoid_ub={props.avoid_ub} />)}
            <div id="post-wrapper" class={{ visible: showThread }}>
                {thread.posts.$.map((post: Post, index: number) => (
                    (index > 0) ? <PostComponent post={post} avoid_ub={props.avoid_ub} /> : null
                ))}
            </div>
        </div>
    }

    if (thread.deleted) {
        return <li class="thread-container">
            <i>Thread deleted...</i>
        </li>
    }

    return <li class="thread-container" >
        {always(delete_button)}
        {post_container()}
        {always(thread_action)}
        <button id="showThreadBtn" class={{ visible: isMoreThanOne }}
            onclick={() => {
                showThread.val = !showThread.val
            }}>{toggle_button_text}</button>
    </li>

})
export class ThreadComponent extends Component<Props> { }