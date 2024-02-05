import { Component } from "uix/components/Component.ts";
import { delete_reply, edit_reply, set_post_ub, add_to_possible_ub, get_user, verify } from "backend/data.ts";
import { Datex } from "unyt_core/datex.ts";
import { PostStatus, Role, Post } from "common/classes.ts";

// formats date into string
export function display_date(time: Date) {
    const timeDifference = Date.now() - time.getTime();

    if (timeDifference > 24 * 60 * 60 * 1000) {
        return time.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
    } else if (timeDifference > 60 * 60 * 1000) {
        const hours = Math.floor(timeDifference / (60 * 60 * 1000));
        return hours > 1 ? `${hours} hours ago` : '1 hour ago';
    } else if (timeDifference > 60 * 1000) {
        const minutes = Math.floor(timeDifference / (60 * 1000));
        return minutes > 1 ? `${minutes} minutes ago` : '1 minute ago';
    } else {
        return 'just now';
    }
}

// checks if user can edit
export function editable(prop_time: Date, prop_author: string, username: string) {
    const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60000)
    console.log(prop_author, username)
    return (prop_time >= tenMinutesAgo) && (prop_author == username)
}

interface Props {
    post: Post,
    avoid_ub: boolean
}

@template<Props>(async (props, { post }) => {

    const alias = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Gast")
    const user = await get_user(alias.val)

    const post_author = await get_user(post.author)

    const toggle_edit = always(() => {
        return editable(post.time as Date, post.author, alias)
    })
    const prop_time = always(() => {
        return post.edited ? display_date(post.time as Date) + " (edited)" : display_date(post.time as Date)
    })
    const edit_modal_visible = $$(false)
    const edit = $$(post.content)

    function do_edit() {
        edit_reply(post, edit.val)
        edit_modal_visible.val = !edit_modal_visible.val
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            do_edit();
        }
    }

    const blurActive = always(() => {
        if(props.avoid_ub == true) {
            return post.status === PostStatus.UB
        } return false
    })

    // Role Specific interaction
    const user_interaction = () => {
        if (user.role == Role.User) {
            return <div class="interaction-buttons">
                {edit_button()}
                {report_button()}
            </div>
        } else {
            return <div></div>
        }
    }

    const mod_interaction = () => {
        if (user.role == Role.Mod) {
            return <div class="interaction-buttons">
                {verify_button()}
                {set_ub_button()}
            </div>
        } else {
            return <div></div>
        }
    }

    const admin_interaction = () => {
        if (user.role == Role.Admin) {
            return <div class="interaction-buttons">
                {delete_button()}
                {verify_button()}
                {set_ub_button()}
            </div>
        } else {
            return <div></div>
        }
    }

    // Buttons
    const report_button = () => {
        return <button class="reportBtn" onclick={() => add_to_possible_ub(post)}>
            melden
        </button>
    }

    const edit_button = () => {
        if (post.author == user.datex_alias) {
            return <div>
                <button id="edit-button" class={{ visible: toggle_edit }} onclick={() => { edit_modal_visible.val = !edit_modal_visible.val }}>edit</button>

                <div id="edit-modal" class={{ visible: edit_modal_visible }}>
                    <fieldset>
                        <legend>edit mode</legend>
                        <input type="text" placeholder={"edit here"} id="edit-textbox"
                            onkeypress={handleKeyPress} value={edit} />
                        <button onclick={do_edit}>send edit</button>
                    </fieldset>
                </div>
            </div>
        } else {
            return <div></div>
        }
    }

    const verify_button = () => {
        return <button onclick={() => verify(post)}>verify</button>
    }

    const set_ub_button = () => {
        return <button onclick={() => set_post_ub(post)}>set ub</button>
    }

    const delete_button = () => {
        return <button onclick={() => delete_reply(post)}>delete</button>
    }

    if (post.status == PostStatus.Deleted) {
        if (user.role == Role.Mod || user.role == Role.Admin) {
            return <li class="post">
                <i>Post deleted...</i>
            </li>
        } else {
            return <div></div>
        }
    } else {
        return <li class={{ blur: blurActive, post: true }} >
            <div class="postBody">
                {always(() => post.content)}
                {always(user_interaction)}
                {always(mod_interaction)}
                {always(admin_interaction)}

            </div>
            <div class="postHead">
                <b>{post_author.name} - </b>
                <i class="date">{prop_time}</i>
            </div>
        </li >
    }
})

export class PostComponent extends Component<Props> { }