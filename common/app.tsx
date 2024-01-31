import { Component } from "uix/components/Component.ts";
import { add_new_discussion, all_discussions, get_username, get_user_role, add_new_user, all_members } from "backend/data.ts";
import { DiscussionComponent } from "common/DiscussionComponent.tsx";
import { UserManagementComponent } from "common/UserManagementComponent.tsx"
import { Discussion, Role, User } from "common/classes.ts";
import { Datex } from "unyt_core/datex.ts";

import { AuthIcon } from "auth";
import { querySelectorAll } from "uix/uix-dom/dom/shadow_dom_selector.ts";
import { allowNone } from "uix/app/args.ts";


@template(async () => {
	const title = $$("")
	const author = $$(await Datex.Runtime.endpoint.main.getAlias() ?? "Gast")
	const user_role = await get_user_role(author.val)
	const user_name = await get_username(author.val)
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
		const discussions_array = Array.from(all_discussions)
		return avoid_UB.val ? (discussions_array.filter(filterfunc)).filter((discussion: Discussion) => discussion.isUB == false) : discussions_array.filter(filterfunc)
	})

	function add_discussion() {
		add_new_discussion(title.val, author.val, intro_arg.val, makeUB.val)
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
		if (user_role == Role.Admin || user_role == Role.User) {
			return <div>
				<button onclick={() => {
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
		}
	}

	const header = () => {
		switch (user_role) {
			case Role.None: return <h1>hallo Hacker, die Polizei ist schon auf dem Weg zu dir</h1>
			case Role.User: return <h1>NSDF - Viel Spaß hier!</h1>
			case Role.Admin: return <h1>NSDF - Admin Modus</h1>
			case Role.Guest: return <h1>NSDF - Gast Modus - nur lesen möglich</h1>
			case Role.Mod: return <h1>NSDF - Mod Modus</h1>
		}
	}

	const user_registration = () => {
		if (user_name == "Neuer User") {

			return <fieldset>
				<legend>User Registration</legend>
				<p>Welcome to our Forum! Your are now logged in via Unyt Auth. Enter your Name to participate.</p>
				<input type="text" placeholder="Your name" value={new_user_name} />
				<button onclick={() => {
					add_new_user(new_user_name.val)
				}}>Register</button>
			</fieldset>
		}
	}

	const user_management = () => {
		return all_members.map(user => <UserManagementComponent user={user} />)
	}

	const role_related_tab_title = () => {
		if(user_role == Role.User) {
			return <div class="tab_title" onclick={() => switchTab(1)}>
				My posts
			</div>
		} else if(user_role == Role.Mod) {
			return <div class="tab_title" onclick={() => switchTab(1)}>
				Reported posts
			</div>
		} else if(user_role == Role.Admin) {
			return <div class="tab_title" onclick={() => switchTab(1)}>
				User management
			</div>
		}
	}

	const role_related_tab = () => {
		if(user_role == Role.User) {
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
		} else if(user_role == Role.Mod) {
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
		} else if(user_role == Role.Admin) {
			return <div id="role_related_tab" class="tab">
				{user_management()}
			</div>
		}
	}

	function switchTab(index: number) {
		const tab_title = document.querySelectorAll(".tab_title") as NodeListOf<HTMLDivElement>;
		const tabs = document.querySelectorAll(".tab") as NodeListOf<HTMLDivElement>;
		tab_title.forEach(tab_title => tab_title.classList.toggle("active"));
		if(tabs.length == 2) {
			if(index == 0) {
				tabs[0].style.display = "block";
				tabs[1].style.display = "none";
			} else {
				tabs[1].style.display = "block";
				tabs[0].style.display = "none";
			}
		}
	}	

	return <div>
		<header id="headerelem">
			<div id="logo">
				<AuthIcon style="float: right;" />
				<b style="float: right;" >{user_name}</b>
				{header()}
				{user_registration()}
				<hr></hr>

			</div>
			<div class="tabs">
				<div class="tab_title active" onclick={() => switchTab(0)}>
					Discussions
				</div>
				{role_related_tab_title()}
			</div>
		</header>

		{user_management()}

		<div id="discussions_tab" class="tab">
			<div id="actions">
				{user_interaction()}
				<input type="text" id="suchfeld" placeholder="Suche" value={search_term} />

				<input type="checkbox" id="showUB" onclick={() => { avoid_UB.val = !avoid_UB.val, console.log(avoid_UB.val) }} />
				<label for="showUB">Hide UB</label>
			</div>

			<div class="discussions">
				{always(() => filtered_discussions.map((discussion: Discussion, index: number) => <DiscussionComponent discussion={discussion} opened={index === openedDiscussion.val} onclick={() => openedDiscussion.val = index} />))}
			</div>
		</div>

		{role_related_tab()}

		<footer id="footer">
			<a href="">Impressum</a>
			<a href="https://de.wikipedia.org/wiki/Datenschutz-Grundverordnung">DSGVO</a>
		</footer>
	</div>
})



export class App extends Component { }