import { Component } from "uix/components/Component.ts";
import { delete_reply, edit_reply, get_username, add_to_possible_ub, get_user, possible_ub_posts } from "backend/data.ts";
import { Datex } from "unyt_core/datex.ts";
import { PostStatus, Role } from "common/classes.ts";

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
    return (prop_time >= tenMinutesAgo) && (prop_author.val == username.val)
}

interface Props {
    _id: number,
    discussion_id: number,
    thread_id: number,
    author: string,
    content: string,
    time: Date,
    edited: boolean,
    status: PostStatus
}

@template<Props>(async (props) => {

    const alias = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Gast")
    const user = await get_user(alias.val)

    const post_author = await get_user(props.author)

    const toggle_edit = always(() => {
        return editable(props.time as Date, props.$.author, alias)
    })
    const prop_time = always(() => {
        return props.$.edited.val ? display_date(props.time as Date) + " (edited)" : display_date(props.time as Date)
    })
    const edit_modal_visible = $$(false)
    const edit = $$(props.$.content)

    function do_edit() {
        edit_reply(props, edit.val)
        edit_modal_visible.val = !edit_modal_visible.val
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            do_edit();
        }
    }

    const user_interaction = () => {
        if (user.role == Role.User || user.role == Role.Admin) {
            return <div class="interaction-buttons">
                {edit_button()}
                {delete_button()}
                {report_button()}
            </div>
        } else {
            return <div></div>
        }
    }

    const report_button = () => {
        if (user.role == Role.User) {
            return <button class="reportBtn" onclick={() => add_to_possible_ub(props)}>
                Report as UB
            </button>
        } else {
            return <div></div>
        }
    }

    const edit_button = () => {
        if (props.author == user.datex_alias) {
            return <div>
                <button id="edit-button" class={{ visible: toggle_edit }} onclick={() => { edit_modal_visible.val = !edit_modal_visible.val }}>edit</button>

                <div id="edit-modal" class={{ visible: edit_modal_visible }}>
                    <fieldset>
                        <legend>edit mode</legend>
                        <input type="text" placeholder={"edit here"} id="edit-textbox"
                            onkeypress={handleKeyPress} value={edit} />
                    </fieldset>
                    <button onclick={do_edit}>send edit</button>
                </div>
            </div>
        } else {
            return <div></div>
        }
    }

    const delete_button = () => {
        if (user.role == Role.Mod || user.role == Role.Admin) {
            return <button onclick={() => delete_reply(props)}>delete</button>
        } else {
            return <div></div>
        }
    }

    if (props.status == PostStatus.Deleted) {
        if (user.role == Role.Mod || user.role == Role.Admin) {
            return <li class="post">
                <i>Post deleted...</i>
            </li>
        }
    } else {
        return <li class="post" >
            <div class="postBody">
                {props.$.content}
                {always(user_interaction)}
            </div>
            <div class="postHead">
                <b>{post_author.name} - </b>
                <i class="date">{prop_time}</i>
            </div>
        </li >
    }
})

export class PostComponent extends Component<Props> { }