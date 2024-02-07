import { Component } from "uix/components/Component.ts";
import { add_new_discussion, all_discussions, possible_ub_posts, add_new_user, all_members, get_user } from "backend/data.ts";
import { DiscussionComponent } from "common/DiscussionComponent.tsx";
import { PostComponent } from "common/PostComponent.tsx";
import { UserManagementComponent } from "common/UserManagementComponent.tsx"
import { Discussion, Post, Role, User } from "common/classes.ts";
import { Datex } from "unyt_core/datex.ts";

@template(async () => {

	const endpoint = $$(await Datex.Runtime.endpoint.main)
	const user = await get_user(endpoint.toString())

	const title = $$("")
	const intro_arg = $$("")

	const new_user_name = $$("")

	const modal_visible = $$(false)
	const avoid_UB = $$(true)
	const search_term = $$("")

	const makeUB = $$(false)

	const expandedDiscussion = $$(-1)

	const all_reported_posts = always(() => {
		return Array.from(possible_ub_posts)
	})

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
		const textarea = document.getElementById("intro-arg")! as HTMLTextAreaElement
		intro_arg.val = textarea.value
		add_new_discussion(title.val, user.endpoint, intro_arg.val, makeUB.val)
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
						<textarea placeholder={"Intro Argument"} id="intro-arg" onkeypress={handleKeyPress} />
						<button onclick={add_discussion}> Make Discussion Public</button>
					</fieldset>
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

	function handleuserregistration(event) {
		if (event.key === "Enter") {
			add_new_user(new_user_name.val)
		}
	}

	const user_registration = () => {
		if (!all_members.map((user: User) => user.endpoint).includes(endpoint.toString())) {
			return <fieldset>
				<legend>Neuer Nutzer</legend>
				<p>Willkommen im NSDF. Gib deinen Namen ein, um deinen Endpoint bei uns zu registrieren. Dann kannst du loslegen und an den Diskussionen teilnehmen.</p>
				<input type="text" placeholder="Dein Name" value={new_user_name} onkeypress={handleuserregistration} />
				<button onclick={() => {
					add_new_user(new_user_name.val)
				}}>Registrieren</button>
			</fieldset>
		} else {
			return <div></div>
		}
	}

	const user_management = () => {
		return all_members.map(user => <UserManagementComponent user={user} />)
	}

	const own_posts = () => {
		return user.posts.map((post: Post) => <PostComponent post={post} avoid_ub={avoid_UB} />)
	}

	const reported_posts = () => {
		return all_reported_posts.map((post: Post) => <PostComponent post={post} avoid_ub={avoid_UB} />)
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
		} else {
			return <div></div>
		}
	}

	const role_related_tab = () => {
		if (user.role == Role.User) {
			return <div id="role_related_tab" class="tab">
				{always(own_posts)}
			</div>
		} else if (user.role == Role.Mod) {
			return <div id="role_related_tab" class="tab">
				{always(reported_posts)}
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
		if (tabs.length == 2) {
			if (index == 0) {
				tabs[0].style.display = "block";
				tabs[1].style.display = "none";
				tab_title[0].classList.add("active")
				tab_title[1].classList.remove("active")

			} else {
				tabs[1].style.display = "block";
				tabs[0].style.display = "none";
				tab_title[1].classList.add("active")
				tab_title[0].classList.remove("active")
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
			<div class="inactive-circle"></div>
		</div>
	}

	const discussions_tab = () => {
		return <div id="discussions_tab" class="tab">
			<div id="actions">
				{always(user_interaction)}
			</div>

			<div class="discussions">
				{all_discussions.$.map((discussion: Discussion) => (
					<DiscussionComponent discussion={discussion} avoid_ub={avoid_UB} expanded_discussion={expandedDiscussion} onclick={() => expandedDiscussion.val = discussion._id} />
				))}
			</div>
		</div>
	}

	return <html>
		<nav id="headerelem">
			<b style="float: right;" >Hallo, {always(() => user.name)}</b>
			{always(header)}
			{ub_toggle()}
			{always(user_registration)}
			<hr></hr>

			{always(tab_selector)}
		</nav>

		<main>

			{always(user_management)}
			<aside class="suggested-discussions">
				Diese Diskussionen könnten dir gefallen:
				<ul>
					<li>Beispiel Diskussion 1</li>
					<li>Beispiel Diskussion 2</li>
					<li>Beispiel Diskussion 3</li>
				</ul>
			</aside>

			{discussions_tab()}

			{always(role_related_tab)}
		</main>

		<footer id="footer">
			<a href="">Impressum</a>
			<a href="https://de.wikipedia.org/wiki/Datenschutz-Grundverordnung">DSGVO</a>
		</footer>
	</html>
})

export class App extends Component { }