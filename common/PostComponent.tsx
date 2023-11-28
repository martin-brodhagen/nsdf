import { Component } from "uix/components/Component.ts";

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


interface Props {
    _id: number,
    isUB: boolean,
    author: string,
    content: string,
    time: Date
}

@template<Props>((props) =>
    <li class="post">
        <div class="postHead">
            <b>{props.author}</b>
            <br />
            <i class="date">{display_date(props.time)}</i>
            <div class="optionsWrapper">
                <button class="optionsBtn" id={`optionsBtn_${props._id}`} onclick={() => open_modal(props._id)}>...</button>
                <div class="postOptionsModal" id={`postOptionsModal_${props._id}`}>
                    <a href="">Option 1</a>
                    <a href="">Option 2</a>
                    <a href="">Option 3</a>
                    <a href="">Option 4</a>
                </div>
            </div>
        </div>
        <div class="postBody">
            {props.content}
        </div>
    </li>
)

export class PostComponent extends Component<Props> { }