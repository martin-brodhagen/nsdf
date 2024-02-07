import { Component } from "uix/components/Component.ts";
import { Role, Discussion, Thread } from "common/classes.ts";
import { ThreadComponent } from "common/ThreadComponent.tsx";
import { start_new_thread, delete_discussion, get_user, edit_tldr } from "backend/data.ts";
import { Datex } from "unyt_core/datex.ts";


interface Props {
    discussion: Discussion,
    avoid_ub: boolean,
    expanded_discussion: number
}


@template<Props>(async (props, { discussion }) => {

    const endpoint = $$(await Datex.Runtime.endpoint.main)
    const user = await get_user(endpoint.toString())

    const discussion_author = await get_user(discussion.author)

    const thread_starter_text = $$("")
    const tldr_edit_text = $$("")
    const thread_modal_visible = $$(false)
    const tldr_edit_modal_visible = $$(false)

    const isExpanded = always(() => {
        return props.expanded_discussion == discussion._id
    })

    const tldr_visible = always(() => {
        return discussion.tldr.length > 2
    })

    function start_thread() {
        start_new_thread(discussion, user, thread_starter_text.val)
        thread_modal_visible.val = !thread_modal_visible.val
        thread_starter_text.val = ""
    }
    function handleKeyPressForNewThread(event) {
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
                        <input type="text" placeholder={"Thread Starter"} id="thread-starter" onkeypress={handleKeyPressForNewThread} value={thread_starter_text} />
                        <button onclick={start_thread}>Start this Thread</button>
                    </fieldset>
                </div>
            </div>
        } else {
            return <div></div>
        }
    }

    const delete_button = () => {
        if (user.role == Role.Admin) {
            return <button onclick={() => delete_discussion(discussion)}>delete Discussion {discussion._id}</button>
        } else {
            return <div></div>
        }
    }

    function do_tldr_edit() {
        const textarea = document.getElementsByClassName("tldr-edit-textbox")[discussion._id] as HTMLTextAreaElement
        tldr_edit_text.val = textarea.value
        edit_tldr(discussion, tldr_edit_text.val)
        tldr_edit_modal_visible.val = !tldr_edit_modal_visible
    }

    function handle_keypress_for_tldr(event) {
        if (event.key === 'Enter') {
            do_tldr_edit()
        }
    }

    const tldr_edit_button = () => {
        if (user.role == Role.Mod) {
            return <div style={{ display: isExpanded.val }}>
                <div class="tlrd-edit-button">
                    <button onclick={() => {
                        const textarea = document.getElementsByClassName("tldr-edit-textbox")[discussion._id] as HTMLTextAreaElement
                        textarea.value = discussion.tldr
                        tldr_edit_modal_visible.val = !tldr_edit_modal_visible.val
                    }}>edit TLDR</button>
                </div>
                <div id="tldr-edit-modal" class={{ visible: tldr_edit_modal_visible }}>
                    <fieldset>
                        <legend>tldr</legend>
                        <p>{discussion.intro_argument}</p>
                        <textarea placeholder={"TLDR goes here"} class="tldr-edit-textbox" onkeypress={handle_keypress_for_tldr} />
                        <button onclick={do_tldr_edit}>edit</button>
                    </fieldset>
                </div>
            </div>
        } else {
            return <div></div>
        }
    }

    const pseudonym = () => {
        if (user.role == Role.Guest) {
            return <div class="user-pseudonym">Gast - nur lesen möglich</div>
        } else if (user.role == Role.None) {
            return <div class="user-pseudonym">keine Rolle, keine Rechte</div>
        } else {
            return <div class="user-pseudonym">In dieser Diskussion bist du: {user.pseudonyms[discussion._id]}</div>
        }
    }

    const title = () => {
        return <h5 class={{ isUB: discussion.$.isUB }}>{discussion.title} - by {discussion_author.pseudonyms[discussion._id]}</h5>
    }

    const tldr = () => {
        return <div class="discussion-tldr" style={{ display: tldr_visible }}>
            <p>{always(() => discussion.tldr)}</p>
        </div>
    }

    if (discussion.deleted) {
        return <div></div>
    }

    return <div id="discussion-container">
        {always(delete_button)}
        {always(tldr_edit_button)}
        {always(pseudonym)}

        {title()}

        {always(user_interaction)}

        {tldr()}

        <div class="expanded-discussion-content" style={{ display: isExpanded }}>
            <div class="intro-argument">
                <p>{discussion.intro_argument}</p>
            </div>

            <div class="all-threads-container">
                {discussion.threads.$.map((thread: Thread) => <ThreadComponent thread={thread} avoid_ub={props.avoid_ub} />)}
            </div>
        </div>


    </div>

})

export class DiscussionComponent extends Component<Props> { }
