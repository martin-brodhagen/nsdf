import { add_new_discussion, all_discussions } from "backend/data.ts";
import { DiscussionComponent } from "common/DiscussionComponent.tsx";
import { Discussion } from "backend/classes.ts";

const title = $$("")
const author = $$("")
const intro_arg = $$("")

export default
    <main class="start-page">
        <header>
            <div>
                <h1>NSDF - Viel Spaß hier!</h1>
            </div>
        </header>

        <input type="text" placeholder={"Discussion Title"} id="discussion-title" value={title} />
        <input type="text" placeholder={"Author"} id="discussion-author" value={author} />
        <input type="text" placeholder={"Intro Argument"} id="intro-arg" value={intro_arg} />
        <button onclick={() => add_new_discussion(title.val, author.val, intro_arg.val)}>+ Discussion</button>
        <button onclick={() => all_discussions.pop()}> delete </button>

        <section class="discussions">
            {all_discussions.$.map((discussion: Discussion) => <DiscussionComponent {...discussion} />)}
        </section>

        <footer>
            <p>this is the footer!</p>
        </footer>
    </main >
