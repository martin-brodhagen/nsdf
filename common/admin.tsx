import { all_discussions } from "backend/data.ts";
import { DiscussionComponent } from "common/DiscussionComponent.tsx";
import { Discussion } from "common/classes.ts";
import { Datex } from "unyt_core/datex.ts";

import { AuthIcon } from "auth";


const avoid_UB = $$(false)
const search_term = $$("")

function filterfunc(discussion: Discussion) {
    const threads = discussion.threads

    return (discussion.title.toLowerCase().includes(search_term.val.toLowerCase())
        || discussion.intro_argument.toLowerCase().includes(search_term.val.toLowerCase())
        || threads.some((thread) => thread.posts.some((post) => post.content.toLowerCase().includes(search_term.val.toLowerCase()))))
}

const filtered_discussions: Datex.Ref<Discussion[]> = always(() => {
    return avoid_UB.val ? (all_discussions.filter(filterfunc)).filter((discussion: Discussion) => discussion.isUB == false) : all_discussions.filter(filterfunc)
})

export default
    <main class="start-page">
        <header id="headerelem">
            <div id="logo">
                <h1>NSDF - Admin Modus</h1>
            </div>
        </header>

        <div id="actions">
            <button onclick={() => {
            }}>New Discussion</button>

            <input type="text" id="suchfeld" placeholder="Suche" value={search_term} />

            <input type="checkbox" id="showUB" onclick={() => { avoid_UB.val = !avoid_UB.val, console.log(avoid_UB.val) }} />
            <label for="showUB">Hide UB</label>

        </div>

        <div class="discussions">
            {always(() => filtered_discussions.map((discussion: Discussion) => <DiscussionComponent {...discussion} />))}
        </div>

    </main >
