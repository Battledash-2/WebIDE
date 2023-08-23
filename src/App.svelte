<script>
	// vscode wasn't intellisensing when i imported from svroutes 🤷‍♂️
	import Route from 'svroutes/src/Route.svelte';
	// @ts-ignore
	import Router from 'svroutes/src/Router.svelte';

	import Main from './components/Main.svelte';
	import File from './components/File.svelte';
	import EditProject from './components/EditProject.svelte';

	import './styles/App.css';

	import { get } from './hooks/localStorage.js';

	const projects = get('projects', []);
	console.log($projects);
</script>

<div id="container">
	<Router home="/">
		<Route path="edit/:project" exact component={EditProject} {projects} />
		<Route path=":project/.*" exact component={File} {projects} />

		<Route index component={Main} {projects} />
	</Router>
</div>
