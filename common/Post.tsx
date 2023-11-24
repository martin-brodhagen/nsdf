import { Component } from "uix/components/Component.ts";

interface Props {
    _id: number,
    isUB: boolean,
    author: string,
    content: string
}

@template<Props>((props) =>
    <li>
        <input type="checkbox" class="isUB" checked={props.isUB} />
        {props.content} - by <b>{props.author}</b>
        <hr></hr>
    </li>
)


export class Post extends Component<Props> { }