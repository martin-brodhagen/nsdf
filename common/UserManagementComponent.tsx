import { Component } from "uix/components/Component.ts";
import { User, Post, PostStatus } from "common/classes.ts";

interface Props {
	user: User
}

@template<Props>((_, { user }) => {
	const ub_rate = always(() => {
		if(user.posts.length > 0) {
			const count_ub_posts = user.posts.filter((post: Post) => post.status === PostStatus.UB).length
			return "UB rate: " +  ((count_ub_posts / user.posts.length) * 100).toFixed(2) + "%"
		} else return "Not posted yet"
	})

	return <fieldset>
		<legend>{user.datex_alias}</legend>
		{user._id}: {user.name} - <select value={user.$.role} >
			<option value="0">None</option>
			<option value="1">User</option>
			<option value="2">Admin</option>
			<option value="3">Guest</option>
			<option value="4">Mod</option>
		</select>
		<div class="statistics">
			{ub_rate}
		</div>
	</fieldset>


})
export class UserManagementComponent extends Component<Props> { }