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

	const avoid_UB = $$(true)
	const search_term = $$("")

	const makeUB = $$(false)

	const expandedDiscussion = $$(-1)

	const all_reported_posts = always(() => {
		return Array.from(possible_ub_posts)
	})

	const all_participated_discussions = always(() => {
		return Array.from(user.participated_discussions)
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
		const modal = document.querySelector("#add-discussion-modal") as HTMLDialogElement
		intro_arg.val = textarea.value
		add_new_discussion(title.val, user, intro_arg.val, makeUB.val)
		modal.close()
		title.val = ""
		intro_arg.val = ""
		textarea.value = ""
		textarea.style.height = "38px"
	}

	function handleKeyPress(event) {
		if (event.key === 'Enter') {
			add_discussion();
		}
	}

	const user_interaction = () => {
		if (user.role == Role.Admin || user.role == Role.User) {
			return <div>
				<button onclick={() => {
					const modal = document.querySelector("#add-discussion-modal") as HTMLDialogElement
					modal.showModal()
				}}>New Discussion</button>

				<dialog id="add-discussion-modal" class="modal">
					<fieldset>
						<legend>New Discussion</legend>
						<input type="text" placeholder={"Discussion Title"} id="discussion-title" minlength={3} maxlength={20} value={title} />
						<textarea
							placeholder={"Intro Argument"}
							id="intro-arg"
							onkeypress={handleKeyPress}
							onkeydown={() => {
								const self = document.getElementById("intro-arg") as HTMLTextAreaElement
								const scroll_height = self.scrollHeight
								self.style.height = `${scroll_height.toString()}px`
							}}
						/>
						<button onclick={add_discussion}> Make Discussion Public</button>
						<button onclick={() => {
							const modal = document.querySelector("#add-discussion-modal") as HTMLDialogElement
							const textarea = document.getElementById("intro-arg")! as HTMLTextAreaElement
							modal.close()
							textarea.value = ""
						}}>Abbrechen</button>
					</fieldset>
				</dialog>
			</div>
		} else {
			return <div></div>
		}
	}

	const header = () => {
		switch (user.role) {
			case Role.None: return <h1>hallo Hacker, die Polizei ist schon auf dem Weg zu dir</h1>
			case Role.User: return <h1><span class={{glow: avoid_UB.val, n: !avoid_UB.val}}>N</span><span class="glow">SDF</span></h1>
			case Role.Admin: return <h1>NSDF - Admin Modus</h1>
			case Role.Guest: return <h1><span class={{glow: avoid_UB.val, n: !avoid_UB.val}}>N</span><span class="glow">SDF</span></h1>
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
				<input type="text" placeholder="Dein Name" maxlength={10} value={new_user_name} onkeypress={handleuserregistration} />
				<button onclick={() => {
					add_new_user(new_user_name.val)
				}}>Registrieren</button>
			</fieldset>
		} else {
			return <div></div>
		}
	}

	function scrollToDiscussion(id: number) {
		switchTab(0)
		expandedDiscussion.val = id
		const discussionElement = document.getElementById("discussion_" + id)
		if (discussionElement) {
			discussionElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
		}
	}

	const user_management = () => {
		return all_members.map(user => <UserManagementComponent user={user} />)
	}

	const participated_discussions = () => {
		return all_participated_discussions.map((discussion: Discussion) =>
			<div class="discussion-preview" onclick={() => scrollToDiscussion(discussion._id)}>
				<p>{discussion.title} - {discussion.num_posts} Posts</p>
			</div>
		)
	}

	const reported_posts = () => {
		return all_reported_posts.map((post: Post) => <PostComponent post={post} avoid_ub={avoid_UB} />)
	}

	const role_related_tab_title = () => {
		if (user.role == Role.User) {
			return <div class="tab_title" onclick={() => switchTab(1)}>
				meine
			</div>
		} else if (user.role == Role.Mod) {
			return <div class="tab_title" onclick={() => switchTab(1)}>
				reported
			</div>
		} else if (user.role == Role.Admin) {
			return <div class="tab_title" onclick={() => switchTab(1)}>
				users
			</div>
		} else {
			return <div></div>
		}
	}

	const role_related_tab = () => {
		if (user.role == Role.User) {
			return <div id="role_related_tab" class="tab">
				{always(participated_discussions)}
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
		if (user.role === Role.User || user.role === Role.Mod || user.role === Role. Admin) {
			return <div class="tabs">
				<div class="tab_title active" onclick={() => switchTab(0)}>
					alle
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

	const recommended_discussions = () => {
		const recommended = all_discussions.map(x => x).sort((a, b) => b.num_posts - a.num_posts)
		//for (var i = 0; i < recommended.length; i++) console.log(recommended[i])
		if (recommended.length > 0) {
			return <div class="suggested-discussions">
				HOT DISCUSSIONS🔥:
				<br />
				<ul>
					{recommended.slice(0, 3).map(discussion => (

						<div class="discussion-preview" onclick={() => scrollToDiscussion(discussion._id)}>
							<p>{discussion.title} - {discussion.num_posts} Posts</p>
						</div>
					))}
				</ul>
			</div>
		}
		else {
			return <div class="suggested-discussions">
				HOT DISCUSSIONS🔥:
				<br />
				<h3>There are no discussions, yet...</h3>
			</div>
		}
	}

	return <body>
		<div class="grid-container">
			<div class="headerelem">
				{always(tab_selector)}
				{always(header)}
				{ub_toggle()}
				<a href="about-us">Über uns</a>

				<b style="float: right;" >Hallo, {always(() => user.name)}</b>
			</div>
				{always(user_registration)}

			<div class="content">
				{discussions_tab()}

				{always(role_related_tab)}
			</div>

			{always(recommended_discussions)}
		</div>
	</body>
})

export class App extends Component { }