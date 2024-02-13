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

    const endpoint = await $$(Datex.Runtime.endpoint.main)
    const user = await get_user(endpoint.toString())

    const discussion_author = await get_user(discussion.author)

    const thread_starter_text = $$("")
    const tldr_edit_text = $$("")

    const isExpanded = always(() => {
        return props.expanded_discussion == discussion._id
    })

    const tldr_visible = always(() => {
        return discussion.tldr.length > 2
    })

    function start_thread() {
        const textarea = document.getElementById(`thread-starter-${discussion._id}`) as HTMLTextAreaElement
        const modal = document.getElementById(`add-thread-modal-${discussion._id}`) as HTMLDialogElement
        thread_starter_text.val = textarea.value
        textarea.value = ""
        start_new_thread(discussion, user, thread_starter_text.val)
        modal.close()
    }

    function handleKeyPressForNewThread(event) {
        if (event.key === 'Enter') {
            start_thread();
        }
    }

    const new_thread_button = () => {
        if (user.role == Role.Admin || user.role == Role.User) {
            return <div style={{ display: isExpanded.val }}>
                <div class="new-thread-container">
                    <button onclick={() => {
                        const modal = document.getElementById(`add-thread-modal-${discussion._id}`) as HTMLDialogElement
                        modal.showModal()
                    }}>+ Thread</button>
                </div>
                <dialog id={`add-thread-modal-${discussion._id}`} class="modal">
                    <fieldset>
                        <legend>Neuer Thread</legend>
                        <p>{discussion.intro_argument}</p>
                        <textarea
                            id={`thread-starter-${discussion._id}`}
                            placeholder={"Thread Starter"}
                            onkeypress={handleKeyPressForNewThread}
                            onkeydown={() => {
                                const self = document.getElementById(`thread-starter-${discussion._id}`) as HTMLTextAreaElement
                                const scroll_height = self.scrollHeight
                                self.style.height = `${scroll_height.toString()}px`
                            }}
                        />
                        <button onclick={start_thread}>Thread anfangen</button>
                        <button onclick={() => {
                            const textarea = document.getElementById(`thread-starter-${discussion._id}`) as HTMLTextAreaElement
                            const modal = document.getElementById(`add-thread-modal-${discussion._id}`) as HTMLDialogElement
                            modal.close()
                            textarea.value = ""
                        }}>abbrechen</button>
                    </fieldset>
                </dialog>
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
        const textarea = document.getElementById(`tldr-edit-textbox-${discussion._id}`) as HTMLTextAreaElement
        const modal = document.getElementById(`tldr-edit-modal-${discussion._id}`) as HTMLDialogElement
        tldr_edit_text.val = textarea.value
        textarea.value = ""
        edit_tldr(discussion, tldr_edit_text.val)
        modal.close()
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
                        const textarea = document.getElementById(`tldr-edit-textbox-${discussion._id}`) as HTMLTextAreaElement
                        const modal = document.getElementById(`tldr-edit-modal-${discussion._id}`) as HTMLDialogElement
                        textarea.value = discussion.tldr
                        modal.showModal()
                    }}>edit TLDR</button>
                </div>
                <dialog id={`tldr-edit-modal-${discussion._id}`} class="modal">
                    <fieldset>
                        <legend>tldr</legend>
                        <p>{discussion.intro_argument}</p>
                        <textarea
                            id={`tldr-edit-textbox-${discussion._id}`}
                            placeholder={"TLDR goes here"}
                            onkeypress={handle_keypress_for_tldr}
                            onkeydown={() => {
                                const self = document.getElementById(`tldr-edit-textbox-${discussion._id}`) as HTMLTextAreaElement
                                const scroll_height = self.scrollHeight
                                self.style.height = `${scroll_height.toString()}px`
                            }}
                        />
                        <button onclick={do_tldr_edit}>edit</button>
                        <button onclick={() => {
                            const textarea = document.getElementById(`tldr-edit-textbox-${discussion._id}`) as HTMLTextAreaElement
                            const modal = document.getElementById(`tldr-edit-modal-${discussion._id}`) as HTMLDialogElement
                            modal.close()
                            textarea.value = ""
                        }}>abbrechen</button>
                    </fieldset>
                </dialog>
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
            return <div class="user-pseudonym">Hier bist du: {user.pseudonyms[discussion._id]}</div>
        }
    }

    const title = () => {
        return <h5 class={{ isUB: discussion.$.isUB }}>{discussion.title} - {discussion_author.pseudonyms[discussion._id]}</h5>
    }

    const tldr = () => {
        return <fieldset class="discussion-tldr" style={{ display: tldr_visible }}>
            <legend>TLDR (von Mod erstellt)</legend>
            {always(() => discussion.tldr)}
        </fieldset>
    }

    const post_counter_display = always(() => {
        return <div class="post-counter-display">
            {discussion.num_posts + " Posts"}
        </div>
    })

    if (discussion.deleted) {
        return <div></div>
    }

    return <div id={"discussion_" + discussion._id} class="discussion-container">
        {always(delete_button)}
        {always(tldr_edit_button)}
        {post_counter_display}
        {always(pseudonym)}

        {title()}


        {tldr()}

        <div class="expanded-discussion-content" style={{ display: isExpanded }}>
            <div class="intro-argument">
                <p>{discussion.intro_argument}</p>
            </div>

            {always(new_thread_button)}

            <div class="all-threads-container">
                {discussion.threads.$.map((thread: Thread) => <ThreadComponent thread={thread} avoid_ub={props.avoid_ub} />)}
            </div>
        </div>


    </div>

})

export class DiscussionComponent extends Component<Props> { }
