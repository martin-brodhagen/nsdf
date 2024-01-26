import { Component } from "uix/components/Component.ts";
import { delete_reply, edit_reply, get_username, get_user_role } from "backend/data.ts";
import { Datex } from "unyt_core/datex.ts";
import { Role } from "common/classes.ts";

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

let optionsButtonClicked = false;

function clickOutsideHandler(event: Event, id: number) {
    const modal = document.getElementById('postOptionsModal_' + id);

    if (modal != null && !modal.contains(event.target as Node)) {
        close_modal(id);
        optionsButtonClicked = false;
    }
}

export function open_modal(id: number) {
    if (!optionsButtonClicked) {
        optionsButtonClicked = true;
        const btn = document.getElementById('optionsBtn_' + id);
        const modal = document.getElementById('postOptionsModal_' + id);

        if (btn != null) {
            btn.style.visibility = 'visible';
        }
        if (modal != null) {
            modal.style.display = 'block';
            setTimeout(() => {
                window.addEventListener('click', (event) => clickOutsideHandler(event, id), { once: true });
            }, 1);
        }
    }
}

export function close_modal(id: number) {
    const btn = document.getElementById('optionsBtn_' + id);
    const modal = document.getElementById('postOptionsModal_' + id);

    if (btn != null) {
        btn.style.visibility = '';
    }
    if (modal != null) {
        modal.style.display = 'none';
    }
}

export function editable(prop_time: Date, prop_author: string, username: string) {
    const tenMinutesAgo = new Date(new Date().getTime() - 10 * 60000)
    console.log(prop_author, username)
    return (prop_time >= tenMinutesAgo) && (prop_author.val == username.val)
}
const viewer = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Gast")
const user_role = await get_user_role(viewer.val)

interface Props {
    _id: number,
    discussion_id: number,
    thread_id: number,
    isUB: boolean,
    author: string,
    content: string,
    time: Date,
    deleted: boolean,
    edited: boolean
}

@template<Props>(async (props) => {
    const author = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Martin")
    console.log(author.val)
    const toggle_edit = always(() => {
        return editable(props.time as Date, props.$.author, author)
    })
    const prop_time = always(() => {
        return props.$.edited.val ? display_date(props.time as Date) + " (edited)" : display_date(props.time as Date)
    })
    const edit_modal_visible = $$(false)
    const edit = $$(props.$.content)

    function user_interaction() {
        if (user_role == Role.Admin || user_role == Role.User) {
            return <div>
                {edit_button()}
                {delete_button()}
            </div>
        }
    }

    const options_modal = () => {
        if (user_role == Role.User || user_role == Role.Admin) {
            return <div class="optionsWrapper">
                <button class="optionsBtn" id={`optionsBtn_${props._id}`} onclick={() => open_modal(props._id)}>...</button>
                <div class="postOptionsModal" id={`postOptionsModal_${props._id}`}>
                    <a href="">Regelverstoß melden</a>
                    <a href="">Als UB melden</a>
                </div>
            </div>
        }
    }

    const edit_button = () => {
        if (props.author == viewer.val) {
            return <div>
                <button id="edit-button" class={{ visible: toggle_edit }} onclick={() => { edit_modal_visible.val = !edit_modal_visible.val }}>edit</button>

                <div id="edit-modal" class={{ visible: edit_modal_visible }}>
                    <fieldset>
                        <legend>edit mode</legend>
                        <input type="text" placeholder={"edit here"} id="edit-textbox" value={edit} />
                    </fieldset>
                    <button onclick={() => {
                        edit_reply(props, edit.val)
                        edit_modal_visible.val = !edit_modal_visible.val
                    }}>send edit</button>
                </div>
            </div>
        }
    }

    const delete_button = () => {
        if (user_role == Role.Mod || user_role == Role.Admin) {
            return <button onclick={() => delete_reply(props)}>delete</button>
        }
    }

    if (props.deleted) {
        if(user_role == Role.Mod || user_role == Role.Admin) {
            return <li class="post">
            <i>Post deleted...</i>
        </li>
        }
    } else {
        return <li class="post" >
            <div class="postHead">
                <b>{get_username(props.author)} : Post ID {props._id}</b>
                <br />
                <i class="date">{prop_time}</i>
                {options_modal()}
            </div>
            <div class="postBody">
                {props.$.content}
            </div>


            {user_interaction()}

        </li >
    }
}
)

export class PostComponent extends Component<Props> { }