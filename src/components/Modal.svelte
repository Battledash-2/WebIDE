<script context="module">
	import { writable } from 'svelte/store';

	export let enabled = writable(false);
	export function enable(mode = true) {
		enabled.set(mode);
	}
</script>

<script>
	import { enabled as _e } from './Modal.svelte';

	export let header = 'Header';
	export let content = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo accusamus temporibus magnam error ab, quod exercitationem corrupti natus dolorum repudiandae. Porro eum dolorem magni asperiores nam veniam deleniti voluptatum perferendis.`;
	export let prompt = '';
	export let placeholder = '';
	export let value = '';

	export let whenok = (promptval) => {};
	export let promptval = value;

	export let enabled = false;
	_e.set(enabled);

	function fin() {
		whenok(promptval);
		_e.set(false);
	}
</script>

{#if $_e}
	<div id="modal_container">
		<div id="modal">
			<h1 id="modal_header">{header}</h1>
			<p id="modal_content">{content}</p>
			{#if prompt}
				<h5 id="modal_prompt">{prompt}</h5>
				<input id="modal_input" bind:value={promptval} {placeholder} /><br />
			{/if}
			<button id="modal_finish" on:click={fin}>OKAY</button>
		</div>
	</div>
{/if}

<style>
	#modal_finish {
		margin-top: 1rem;
		width: 20rem;
		height: 2rem;
		background-color: #222;
		border: none;
		cursor: pointer;
	}
	#modal_finish:hover {
		background-color: #111;
	}
	#modal_prompt {
		margin-top: 2rem;
		font-weight: 100;
		font-size: 1.2rem;
	}
	#modal_input {
		width: 50%;
		background-color: #555;
		border: none;
		outline: none;
		height: 2rem;
		box-sizing: border-box;
		padding: 0 0.5rem 0 0.5rem;
		font-size: 1rem;
	}
	#modal_content {
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		padding: 0.1rem 0 2rem 0;
		text-align: left;
		white-space: break-spaces;
		word-wrap: break-word;
	}
	#modal_container {
		position: absolute;
		inset: 0;
		width: 100dvw;
		height: 100dvh;
		background: rgb(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		align-content: center;
		justify-content: center;
		z-index: 999;
	}
	#modal_header {
		margin-bottom: 0.5rem;
	}
	#modal {
		width: 50rem;
		height: 20rem;
		background-color: #333;
		box-sizing: border-box;
		padding: 1rem;
		border-radius: 0.28rem;
	}
</style>
