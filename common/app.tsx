import { Component } from "uix/components/Component.ts";
import { add_new_discussion, all_discussions, add_new_user, all_members, get_user } from "backend/data.ts";
import { DiscussionComponent } from "common/DiscussionComponent.tsx";
import { UserManagementComponent } from "common/UserManagementComponent.tsx"
import { Discussion, Role, User } from "common/classes.ts";
import { Datex } from "unyt_core/datex.ts";

import { AuthIcon } from "auth";


@template(async () => {

	const alias = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Gast")
	const user = await get_user(alias.val)

	const title = $$("")
	const intro_arg = $$("")

	const new_user_name = $$("")

	const modal_visible = $$(false)
	const avoid_UB = $$(false)
	const search_term = $$("")

	const makeUB = $$(false)

	const openedDiscussion = $$(-1)

	function filterfunc(discussion: Discussion) {
		const threads = discussion.threads

		return (discussion.title.toLowerCase().includes(search_term.val.toLowerCase())
			|| discussion.intro_argument.toLowerCase().includes(search_term.val.toLowerCase())
			|| threads.some((thread) => thread.posts.some((post) => post.content.toLowerCase().includes(search_term.val.toLowerCase()))))
	}

	const filtered_discussions: Discussion[] = always(() => {
		return avoid_UB.val ? (all_discussions.filter(filterfunc)).filter((discussion: Discussion) => discussion.isUB == false) : all_discussions.filter(filterfunc)
	})

	function add_discussion() {
		add_new_discussion(title.val, user.datex_alias, intro_arg.val, makeUB.val)
		modal_visible.val = !modal_visible.val
		title.val = ""
		intro_arg.val = ""
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			add_discussion();
		}
	}

	const user_interaction = () => {
		if (user.role == Role.Admin || user.role == Role.User) {
			return <div>
				<button id="newdi" onclick={() => {
					modal_visible.val = !modal_visible.val
				}}>New Discussion</button>

				<div id="add-discussion-modal" class={{ visible: modal_visible }}>
					<fieldset>
						<legend>New Discussion</legend>
						<input type="text" placeholder={"Discussion Title"} id="discussion-title" value={title} />
						<input type="text" placeholder={"Intro Argument"} id="intro-arg" onkeypress={handleKeyPress} value={intro_arg} />
						<input type="checkbox" id="UBcheck" value={makeUB.val} />
						<label for="UBcheck">Make UB (devtool)</label>
					</fieldset>
					<button onclick={add_discussion}> Make Discussion Public</button>
				</div>
			</div>
		} else {
			return <div></div>
		}
	}

	const header = () => {
		switch (user.role) {
			case Role.None: return <h1>hallo Hacker, die Polizei ist schon auf dem Weg zu dir</h1>
			case Role.User: return <h1>NSDF - Viel Spaß hier!</h1>
			case Role.Admin: return <h1>NSDF - Admin Modus</h1>
			case Role.Guest: return <h1>NSDF - Gast Modus - nur lesen möglich</h1>
			case Role.Mod: return <h1>NSDF - Mod Modus</h1>
		}
	}

	const user_registration = () => {
		if (user.name == "Gast" && alias != "Gast") {
			return <fieldset>
				<legend>User Registration</legend>
				<p>Welcome to our Forum! Your are now logged in via Unyt Auth. Enter your Name to participate.</p>
				<input type="text" placeholder="Your name" value={new_user_name} />
				<button onclick={() => {
					add_new_user(new_user_name.val)
				}}>Register</button>
			</fieldset>
		} else {
			return <div></div>
		}
	}

	const user_management = () => {
		return all_members.map(user => <UserManagementComponent user={user} />)
	}

	const role_related_tab_title = () => {
		if (user.role == Role.User) {
			return <div class="tab_title" onclick={() => switchTab(1)}>
				My posts
			</div>
		} else if (user.role == Role.Mod) {
			return <div class="tab_title" onclick={() => switchTab(1)}>
				Reported posts
			</div>
		} else if (user.role == Role.Admin) {
			return <div class="tab_title" onclick={() => switchTab(1)}>
				User management
			</div>
		}
	}

	const role_related_tab = () => {
		if (user.role == Role.User) {
			return <div id="role_related_tab" class="tab">
				These are my posts (Placeholder):
				<ul>
					<li>Post 1</li>
					<li>Post 2</li>
					<li>Post 3</li>
					<li>Post 4</li>
					<li>Post 5</li>
				</ul>
			</div>
		} else if (user.role == Role.Mod) {
			return <div id="role_related_tab" class="tab">
				These are all reported posts(Placeholder):
				<ul>
					<li>Post 1</li>
					<li>Post 2</li>
					<li>Post 3</li>
					<li>Post 4</li>
					<li>Post 5</li>
				</ul>
			</div>
		} else if (user.role == Role.Admin) {
			return <div id="role_related_tab" class="tab">
				{always(user_management)}
			</div>
		} else {
			return <div></div>
		}
	}

	function switchTab(index: number) {
		const tab_title = document.querySelectorAll(".tab_title") as NodeListOf<HTMLDivElement>;
		const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLDivElement>;
		tab_title.forEach(tab_title => tab_title.classList.toggle("active"));
		if (tabs.length == 2) {
			if (index == 0) {
				tabs[0].style.display = "block";
				tabs[1].style.display = "none";
			} else {
				tabs[1].style.display = "block";
				tabs[0].style.display = "none";
			}
		}
	}

	const tab_selector = () => {
		if (user.role === Role.User || user.role === Role.Mod || user.role === Role.Admin) {
			return <div class="tabs">
				<div class="tab_title active" onclick={() => switchTab(0)}>
					Discussions
				</div>
				{role_related_tab_title()}
			</div>
		} else {
			return <div></div>
		}

	}

	const ub_toggle = () => {
		return <div class="checkbox-container">
			<input type="checkbox" id="ub-toggle" onclick={() => { avoid_UB.val = !avoid_UB.val }} />
			<label for="ub-toggle"></label>
			<div class="active-circle"></div>
		</div>
	}

	return <div>
		<nav id="headerelem">
			<AuthIcon style="float: right;" />
			<b style="float: right;" >{user.name}</b>
			{always(header)}
			{ub_toggle()}
			{always(user_registration)}
			<hr></hr>

			{always(tab_selector)}
		</nav>
		{always(user_management)}

		<div id="discussions_tab" class="tab">
			<div id="actions">
				{always(user_interaction)}
				<input type="text" id="suchfeld" placeholder="Suche" value={search_term} />
			</div>

			<div class="discussions">
				{always(() => filtered_discussions.map((discussion: Discussion, index: number) => <DiscussionComponent discussion={discussion} opened={index === openedDiscussion.val} onclick={() => openedDiscussion.val = index} />))}
			</div>
		</div>

		{always(role_related_tab)}

		<footer id="footer">
			<a href="">Impressum</a>
			<a href="https://de.wikipedia.org/wiki/Datenschutz-Grundverordnung">DSGVO</a>
		</footer>
	</div>
})



export class App extends Component { }