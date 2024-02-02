import { Component } from "uix/components/Component.ts";
import { User } from "common/classes.ts";

interface Props {
	user: User
}

@template<Props>((_, { user }) => {


	return <fieldset>
		<legend>{user.datex_alias}</legend>
		{user._id}: {user.name} - <select value={user.$.role} >
			<option value="0">None</option>
			<option value="1">User</option>
			<option value="2">Admin</option>
			<option value="3">Guest</option>
			<option value="4">Mod</option>
		</select>
	</fieldset>


})
export class UserManagementComponent extends Component<Props> { }