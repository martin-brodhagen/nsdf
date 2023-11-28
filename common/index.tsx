import { add_new_discussion, all_discussions } from "../backend/data.ts";
import { DiscussionComponent } from "./DiscussionComponent.tsx";
import { Discussion } from "../backend/classes.ts";


export default
    <main class="start-page">
        <header>
            <div>
                <h1>NSDF - Viel Spaß hier!</h1>
            </div>
        </header>

        <input type="text" placeholder={"Discussion Title"} id="title" />
        <input type="text" placeholder={"Author"} id="author" />
        <input type="text" placeholder={"Intro Argument"} id="intro-arg" />
        <button onclick={() => add_new_discussion()}>+ Discussion</button>
        <button onclick={() => all_discussions.pop()}> delete </button>

        <section class="discussions">
            {all_discussions.$.map((discussion: Discussion) => <DiscussionComponent {...discussion} />)}
        </section>

        <footer>
            <p>this is the footer!</p>
        </footer>
    </main >
