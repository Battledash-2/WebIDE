<script>
	import { navigate } from 'svroutes/src';
	import '../styles/Main.css';
	export let projects;

	function createProject() {
		// enable();
		let projectName = prompt("Below, enter in the name you'd like for your new project.\nThis name has to be unique.");
		navigate('./edit/' + projectName);
	}
</script>

<div id="container">
	<button id="create" on:click={createProject}>Create Project</button>
	<h1>Welcome back!</h1>
	<div id="projects">
		{#if $projects.length === 0}
			<h3>You have no projects!</h3>
			<p>Hello! Create a project below and start editing.</p>
		{/if}
	</div>
</div>
