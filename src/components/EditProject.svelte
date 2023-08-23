<script>
	import '../styles/Editor.css';
	import { writable } from 'svelte/store';
	import get from '../hooks/localStorage';

	// import { EditorView, basicSetup } from 'codemirror';

	import { EditorState } from '@codemirror/state';
	import { EditorView, keymap } from '@codemirror/view';
	import { defaultKeymap } from '@codemirror/commands';

	import { basicSetup } from 'codemirror';
	import { javascript } from '@codemirror/lang-javascript';

	export let params = { project: '' };
	export let projects = writable([]);

	let projectName = decodeURIComponent(params.project);
	if (!$projects.includes(projectName)) projects.update((u) => u.push(projectName) && u);

	let project = get('!' + projectName, {});
	/**
	 files look like:
	 {
		type?: '{MIME TYPE}',
		content: '{FILE CONTENT}',
		name: '{FILE NAME}',
	 } */
	let cur = $project;

	function create_file() {
		let fn = prompt('Filename:');
		cur[fn] = {
			content: '',
			name: fn,
		};
	}
	function create_folder() {
		let fn = prompt('Folder name:');
		cur[fn] = {};
	}

	// let startState = EditorState.create({
	// 	doc: 'Hello World',
	// 	extensions: [keymap.of(defaultKeymap)],
	// });

	// let editor = new EditorView({
	// 	state: startState,
	// 	extensions: [javascript()],
	// 	parent: document.getElementById('editor'),
	// });
	let value;
	let editor;

	document.addEventListener('DOMContentLoaded', () => {
		// create editor
	});
</script>

<div id="files">
	<nav id="controls">
		<button id="create_file" on:click={create_file}>+ File</button>
		<button id="create_folder" on:click={create_folder}>+ Folder</button>
	</nav>
</div>
<div id="editor" />
