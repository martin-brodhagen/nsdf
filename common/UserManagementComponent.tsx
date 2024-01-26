import { Component } from "uix/components/Component.ts";
import { set_user_role } from "backend/data.ts";
import { User } from "common/classes.ts";

interface Props {
	user: User
}

@template<Props>((_, { user }) => {

	return <fieldset>
		<legend>{user.datex_alias}</legend>
		{user._id}: {user.name} - <select name="roles" id="role-selector" value={user.$.role}>
			<option value="0">None</option>
			<option value="1">User</option>
			<option value="2">Admin</option>
			<option value="3">Guest</option>
			<option value="4">Mod</option>
		</select>  <button onclick={() => set_user_role(user.datex_alias, user.role)}>Update Role</button>
	</fieldset>


})
export class UserManagementComponent extends Component<Props> { }