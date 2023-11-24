import { test_discussion, add_new_reply, remove_replies, new_reply_value, reply_author } from "../backend/data.ts";
import { Post } from "./Post.tsx";


export default
    <main class="start-page">
        <header>
            <div>
                <h1>NSDF - Viel Spaß hier!</h1>
            </div>
        </header>

        <section class="topic">
            <button id="new-topic">Neues Thema</button>
            <h2>{test_discussion.topics[0]._id} - {test_discussion.topics[0].name}</h2>

            <div class="facette">
                <button id="new-facette">Neue Facette</button>
                <h4>{test_discussion.facettes[0]}</h4>

                <div class="discussion">
                    <button id="new-discussion">Neue Diskussion</button>
                    <h6>{test_discussion.title}</h6>

                    <div class="start-argument">
                        <p>{test_discussion.intro_argument}</p>
                    </div>

                    <div class="thread-container">
                        {test_discussion.threads[0].$.posts.$.map(post => <Post {...post} />)}
                    </div>

                    <div>
                        <input type="text" id="new-reply" value={new_reply_value} />
                        <input type="text" id="reply-author" value={reply_author} />
                        <button onclick={() => add_new_reply(reply_author, new_reply_value)}>reply</button>
                        <button onclick={remove_replies}>delete last reply</button>
                    </div>
                </div>

            </div>

        </section>

        <footer>
            <p>this is the footer!</p>
        </footer>
    </main >
