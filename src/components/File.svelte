<script>
	import { navigate } from 'svroutes/src';

	export let wildcards = [''];
	export let params = { project: '' };

	let filePath = wildcards[0];
	let project = params.project;

	if (decodeURIComponent(filePath).trim() == '') navigate('../');
</script>

{filePath}
{project}
