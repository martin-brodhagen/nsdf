import { Component } from "uix/components/Component.ts";
import { Role, Discussion, Thread } from "common/classes.ts";
import { ThreadComponent } from "common/ThreadComponent.tsx";
import { start_new_thread, delete_discussion, get_user } from "backend/data.ts";
import { Datex } from "unyt_core/datex.ts";


interface Props {
    discussion: Discussion,
    avoid_ub: boolean,
    expanded_discussion: number
}


@template<Props>(async (props, { discussion }) => {

    const thread_starter_text = $$("")
    const alias = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Gast")
    const user = await get_user(alias.val)

    const discussion_author = await get_user(discussion.author)

    const thread_modal_visible = $$(false)

    const isExpanded = always(() => {
        return props.expanded_discussion == discussion._id
    })

    function start_thread() {
        start_new_thread(discussion, user, thread_starter_text.val)
        thread_modal_visible.val = !thread_modal_visible.val
        thread_starter_text.val = ""
    }
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            start_thread();
        }
    }

    const user_interaction = () => {
        if (user.role == Role.Admin || user.role == Role.User) {
            return <div style={{ display: isExpanded.val }}>

                <div class="new-thread-container">
                    <button onclick={() => thread_modal_visible.val = !thread_modal_visible.val}>+ Thread</button>
                </div>
                <div id="add-thread-modal" class={{ visible: thread_modal_visible }}>
                    <fieldset>
                        <legend>New Thread</legend>
                        <p>{discussion.intro_argument}</p>
                        <input type="text" placeholder={"Thread Starter"} id="thread-starter" onkeypress={handleKeyPress} value={thread_starter_text} />
                        <button onclick={start_thread}>Start this Thread</button>
                    </fieldset>
                </div>
            </div>
        } else {
            return <div></div>
        }
    }

    const mod_buttons = () => {
        if (user.role == Role.Mod || user.role == Role.Admin) {
            return <button onclick={() => delete_discussion(discussion)}>delete Discussion {discussion._id}</button>
        } else {
            return <div></div>
        }
    }

    const title = () => {
        return <h5 class={{ isUB: discussion.$.isUB }}>{discussion.title} - by {discussion_author.name}</h5>
    }

    if (discussion.deleted) {
        return <div></div>
    }

    return <div id="discussion-container">
        {always(mod_buttons)}

        {title()}

        {always(user_interaction)}

        <div class="intro-argument">
            <p>{discussion.intro_argument}</p>
        </div>

        <div class="all-threads-container" style={{ display: isExpanded }}>
            {discussion.threads.$.map((thread: Thread) => <ThreadComponent thread={thread} avoid_ub={props.avoid_ub} />)}
        </div>


    </div>

})

export class DiscussionComponent extends Component<Props> { }
