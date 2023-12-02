import { add_new_discussion, all_discussions } from "backend/data.ts";
import { DiscussionComponent } from "common/DiscussionComponent.tsx";
import { Discussion } from "common/classes.ts";
import { Datex } from "unyt_core/datex.ts";


const title = $$("")
const author = $$("Anonymous")
const intro_arg = $$("")

const modal_visible = $$(false)
const search_term = $$("")

const filtered_discussions: Discussion[] = always(() => {
    return all_discussions.filter((discussion: Discussion) => discussion.title.includes(search_term))
})

export default
    <main class="start-page">
        <header>
            <div>
                <h1>NSDF - Viel Spaß hier!</h1>
            </div>
        </header>


        <button onclick={() => {
            modal_visible.val = !modal_visible.val
        }}>New Discussion</button>
        <button onclick={() => all_discussions.pop()}>Delete Discussion</button>
        <input type="text" id="suchfeld" placeholder="Suche" value={search_term} />

        <div class="discussions">
            {filtered_discussions.$.map((discussion: Discussion) => <DiscussionComponent {...discussion} />)}
        </div>


        <div id="add-discussion-modal" class={{ visible: modal_visible }}>
            <fieldset>
                <legend>New Discussion</legend>
                <input type="text" placeholder={"Discussion Title"} id="discussion-title" value={title} />
                <input type="text" placeholder={"Intro Argument"} id="intro-arg" value={intro_arg} />
            </fieldset>
            <button onclick={() => {
                add_new_discussion(title.val, author.val, intro_arg.val)
                modal_visible.val = !modal_visible.val
                title.val = ""
                intro_arg.val = ""
            }}>Make Discussion Public</button>
        </div>
    </main >
