import { Component } from "uix/components/Component.ts";
import { Thread } from "common/classes.ts";
import { ThreadComponent } from "common/ThreadComponent.tsx";
import { start_new_thread, delete_discussion } from "backend/data.ts";
import { Datex } from "unyt_core/datex.ts";


interface Props {
    _id: number,
    isUB: boolean,
    author: string,
    title: string,
    intro_argument: string,
    tldr: string,
    facettes: string[],
    threads: Thread[],
    tags: string[],
    deleted: boolean
}

@template<Props>(async (props) => {

    const thread_starter_text = $$("")
    const author = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "martin")

    const thread_modal_visible = $$(false)

    if (props.deleted) {
        return <div id="discussion-container">
            <i>Discussion deleted...</i>
        </div>
    }

    return <div id="discussion-container">
        <button onclick={() => delete_discussion(props)}>delete Discussion: {props._id}</button>
        <h5 class={{ isUB: props.$.isUB }}>{props.title} - by {props.author}</h5>

        <div class="new-thread-container">
            <button onclick={() => thread_modal_visible.val = !thread_modal_visible.val}>+ Thread</button>
        </div>

        <div class="intro-argument">
            <p>{props.intro_argument}</p>
        </div>

        <div class="all-threads-container">
            {always(() => props.threads.map((thread: Thread) => <ThreadComponent {...thread} />))}
        </div>

        <div id="add-thread-modal" class={{ visible: thread_modal_visible }}>
            <fieldset>
                <legend>New Thread</legend>
                <p>{props.intro_argument}</p>
                <input type="text" placeholder={"Thread Starter"} id="thread-starter" value={thread_starter_text} />
            </fieldset>
            <button onclick={() => {
                start_new_thread(props, author, thread_starter_text.val)
                thread_modal_visible.val = !thread_modal_visible.val
                thread_starter_text.val = ""
            }}>Start this Thread</button>
        </div>

    </div>

})

export class DiscussionComponent extends Component<Props> { }
