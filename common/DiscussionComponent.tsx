import { Component } from "uix/components/Component.ts";
import { Role, Thread } from "common/classes.ts";
import { ThreadComponent } from "common/ThreadComponent.tsx";
import { start_new_thread, delete_discussion, get_username, get_user_role } from "backend/data.ts";
import { Datex } from "unyt_core/datex.ts";


interface Props {
    _id: number
    isUB: boolean
    author: string
    title: string
    intro_argument: string
    facettes: string[]
    threads: Thread[]
    tags: string[]
    opened: boolean
    deleted: boolean
}


@template<Props>(async (props) => {

    const thread_starter_text = $$("")
    const author = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Gast")
    const user_role = await get_user_role(author.val)

    const thread_modal_visible = $$(false)

    const user_interaction = () => {
        if (user_role == Role.Admin || user_role == Role.User) {
            return <div>

                <div class="new-thread-container">
                    <button onclick={() => thread_modal_visible.val = !thread_modal_visible.val}>+ Thread</button>
                </div>
                <div id="add-thread-modal" class={{ visible: thread_modal_visible }}>
                    <fieldset>
                        <legend>New Thread</legend>
                        <p>{props.intro_argument}</p>
                        <input type="text" placeholder={"Thread Starter"} id="thread-starter" value={thread_starter_text} />
                    </fieldset>
                    <button onclick={() => {
                        start_new_thread(props, author.val, thread_starter_text.val)
                        thread_modal_visible.val = !thread_modal_visible.val
                        thread_starter_text.val = ""
                    }}>Start this Thread</button>
                </div>
            </div>
        }
    }

    const mod_buttons = () => {
        if (user_role == Role.Mod || user_role == Role.Admin) {
            return <button onclick={() => delete_discussion(props)}>delete Discussion {props._id}</button>
        }
    }

    if (props.deleted) {
        return <div></div>
    }

    return <div id="discussion-container" class={{ visible: props.opened }}>
        {mod_buttons()}

        <h5 class={{ isUB: props.$.isUB }}>{props.title} - by {get_username(props.author)}</h5>

        {user_interaction()}

        <div class="intro-argument">
            <p>{props.intro_argument}</p>
        </div>

        <div class="all-threads-container">
            {always(() => props.threads.map((thread: Thread) => <ThreadComponent {...thread} />))}
        </div>


    </div>

})

export class DiscussionComponent extends Component<Props> { }
