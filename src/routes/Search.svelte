<script>
    import VodGrid from "../components/VodGrid.svelte";
	import ClipGrid from "../components/ClipGrid.svelte";

    export let query;

	async function fetchVods() {
		const response = await fetch(`ENV_BASE_DIR/api/vods/?page_size=18&title=${query}`);
		const vods = await response.json();
		return vods
	}

	async function fetchClips() {
		const response = await fetch(`ENV_BASE_DIR/api/clips/?page_size=18&title=${query}`);
		const clips = await response.json();
		return clips
	}
</script>

<main class="flex-shrink-0">
	<div class="container">
        {#await fetchVods()}
            <h1 class="display-3 fw-bolder pb-3">
                Vod Ergebnisse
            </h1>
			<p>Lade Vods...</p>
		{:then vods}
            <h1 class="display-3 fw-bolder pb-3">
                Vod Ergebnisse <small class="text-muted">{vods.count}</small>
            </h1>
			<VodGrid vods={vods} />
		{:catch error}
			<p>Fehler beim Laden von Vods.</p>
		{/await}
	</div>
	<div class="container">
        {#await fetchClips()}
            <h1 class="display-3 fw-bolder pb-3">
                Clip Ergebnisse
            </h1>
			<p>Lade Clips...</p>
		{:then clips}
            <h1 class="display-3 fw-bolder pb-3">
                Clip Ergebnisse <small class="text-muted">{clips.count}</small>
            </h1>
            <ClipGrid clips={clips} />
		{:catch error}
			<p>Fehler beim Laden von Clips.</p>
		{/await}
	</div>
</main>
