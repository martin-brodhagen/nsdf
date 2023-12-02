import { Component } from "uix/components/Component.ts";
import { Thread } from "common/classes.ts";
import { ThreadComponent } from "common/ThreadComponent.tsx";
import { start_new_thread, remove_a_thread } from "backend/data.ts";


interface Props {
    _id: number
    isUB: boolean
    author: string
    title: string
    intro_argument: string
    facettes: string[]
    threads: Thread[]
    tags: string[]
}

@template<Props>((props) => {

    const thread_starter_text = $$("")
    const author = $$("Responder")

    const thread_modal_visible = $$(false)

    return <div class="discussion-container">
        <h5>{props.title} - by {props.author}</h5>

        <div class="new-thread-container">
            <button onclick={() => thread_modal_visible.val = !thread_modal_visible.val}>+ Thread</button>
            <button onclick={() => remove_a_thread(props.$.threads)}>- Thread</button>
        </div>

        <div class="intro-argument">
            <p>{props.intro_argument}</p>
        </div>

        <div class="thread-container">
            {props.$.threads.$.map((thread: Thread) => <ThreadComponent {...thread} />)}
        </div>

        <div id="add-thread-modal" class={{ visible: thread_modal_visible }}>
            <fieldset>
                <legend>New Thread</legend>
                <p>{props.intro_argument}</p>
                <input type="text" placeholder={"Thread Starter"} id="thread-starter" value={thread_starter_text} />
            </fieldset>
            <button onclick={() => {
                start_new_thread(props.$.threads, author.val, thread_starter_text.val)
                thread_modal_visible.val = !thread_modal_visible.val
                thread_starter_text.val = ""
            }}>Start this Thread</button>
        </div>
    </div>
})

export class DiscussionComponent extends Component<Props> { }
