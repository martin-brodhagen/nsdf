import { add_new_discussion, all_discussions } from "backend/data.ts";
import { DiscussionComponent } from "common/DiscussionComponent.tsx";
import { Discussion } from "common/classes.ts";
import { Datex } from "unyt_core/datex.ts";

import { AuthIcon } from "auth";

const title = $$("")
const author = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Gast")
const intro_arg = $$("")

const modal_visible = $$(false)
const avoid_UB = $$(false)
const search_term = $$("")

const makeUB = $$(false)

const openedDiscussion = $$(-1)

function filterfunc(discussion: Discussion){
    const threads = discussion.threads

    return (discussion.title.toLowerCase().includes(search_term.val.toLowerCase())
        || discussion.intro_argument.toLowerCase().includes(search_term.val.toLowerCase())
        || threads.some((thread) => thread.posts.some((post) => post.content.toLowerCase().includes(search_term.val.toLowerCase()))))
}

const filtered_discussions: Discussion[] = always(() => {
    return avoid_UB.val ? (all_discussions.filter(filterfunc)).filter((discussion: Discussion) => discussion.isUB == false) : all_discussions.filter(filterfunc)
})

export default
    <main class="start-page">
        <header id="headerelem">
            <div id="logo">
                <AuthIcon style="float: right;" />
                <b style="float: right;" >{author}</b>
                <h1>NSDF - Viel Spaß hier!</h1>
                <hr></hr>

            </div>
        </header>

        <div id="actions">
            <button onclick={() => {
                modal_visible.val = !modal_visible.val
            }}>New Discussion</button>

            <input type="text" id="suchfeld" placeholder="Suche" value={search_term} />

            <input type="checkbox" id="showUB" onclick={() => { avoid_UB.val = !avoid_UB.val, console.log(avoid_UB.val) }} />
            <label for="showUB">Hide UB</label>

        </div>

        <div class="discussions">
            { always(() => filtered_discussions.map((discussion: Discussion,index: number) => <DiscussionComponent {...discussion} opened={index === openedDiscussion.val} onclick={() => openedDiscussion.val = index} />)) }
        </div>

        <div id="add-discussion-modal" class={{ visible: modal_visible }}>
            <fieldset>
                <legend>New Discussion</legend>
                <input type="text" placeholder={"Discussion Title"} id="discussion-title" value={title} />
                <input type="text" placeholder={"Intro Argument"} id="intro-arg" value={intro_arg} />
                <input type="checkbox" id="UBcheck" value={makeUB} />
                <label for="UBcheck">Make UB (devtool)</label>
            </fieldset>
            <button onclick={() => {
                add_new_discussion(title.val, author.val, intro_arg.val, makeUB.val)
                modal_visible.val = !modal_visible.val
                title.val = ""
                intro_arg.val = ""
            }}>Make Discussion Public</button>
        </div>

        <footer id="footer">
            <a href="">Impressum</a>
            <a href="">DSGVO</a>
        </footer>
    </main >
