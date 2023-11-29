import { Component } from "uix/components/Component.ts";
import { Thread } from "backend/classes.ts";
import { ThreadComponent } from "common/ThreadComponent.tsx";
import { start_new_thread, remove_a_thread } from "backend/data.ts";


interface Props {
    _id: number
    isUB: boolean
    author: string
    title: string
    intro_argument: string
    facettes?: string[]
    threads?: Thread[]
    tags?: string[]
}

@template<Props>((props) => {

    const thread_starter_text = $$("")
    const author = $$("")

    return <div>
        <h5>{props.title} - by {props.author}</h5>

        <div class="intro-argument">
            <p>{props.intro_argument}</p>
        </div>

        <div class="thread-container">
            {props.$.threads.$.map((thread: Thread) => <ThreadComponent {...thread} />)}
        </div>

        <div class="new-thread-container">
            <input type="text" placeholder={"Thread Starter"} id="thread-starter-text" value={thread_starter_text} />
            <input type="text" placeholder={"Author"} id="thread-author" value={author} />
            <button onclick={() => start_new_thread(props.$.threads, author, thread_starter_text)}>+ Thread</button>
            <button onclick={() => remove_a_thread(props.$.threads)}>- Thread</button>
        </div>
    </div>
})

export class DiscussionComponent extends Component<Props> { }
