<script>
	import { onMount } from 'svelte';
	import { format, formatDistance, parseISO } from 'date-fns';
	import { de } from 'date-fns/locale/index.js';

	import Head from '../components/Head.svelte';
	import Footer from '../components/Footer.svelte';

	// vars
	let emotes;
	let statsDB;
	let vods;
	let clips;
	let query = '';
	let showResults = false;
	let searchFocus = -1;

	onMount(async () => {
		// bootstrap js
		await import('bootstrap/js/dist/base-component');
		await import('bootstrap/js/dist/button');
		await import('bootstrap/js/dist/collapse');
		await import('bootstrap/js/dist/dropdown');
	});

	onMount(() => {
		// close seach results when clicking somewhere else on the page
		document.addEventListener('click', function (e) {
			const searchInput = document.querySelector('#searchInput');
			const searchResults = document.querySelector('#searchResults');
			if (e.target != searchInput && e.target != searchResults) {
				showResults = false;
			}
		});
	});

	// parallel api fetch: https://dmitripavlutin.com/javascript-fetch-async-await/#5-parallel-fetch-requests
	async function fetchApi() {
		const [emoteResponse, statsResponse] = await Promise.all([
			fetch(`${import.meta.env.VITE_BASE_URL}/api/emotes/?page_size=500`),
			fetch(`${import.meta.env.VITE_BASE_URL}/api/stats/db/`)
		]);
		const e = await emoteResponse.json();
		const s = await statsResponse.json();
		return [e, s];
	}

	fetchApi().then(([e, s]) => {
		emotes = e;
		statsDB = s;
	});

	// handle search
	async function fetchSearch() {
		const [vodsResponse, clipsResponse] = await Promise.all([
			fetch(`${import.meta.env.VITE_BASE_URL}/api/vods/?page_size=4&title=${query}`),
			fetch(`${import.meta.env.VITE_BASE_URL}/api/clips/?page_size=4&title=${query}`)
		]);
		const v = await vodsResponse.json();
		const c = await clipsResponse.json();
		return [v, c];
	}

	function search() {
		if (query.length < 3) {
			return;
		}
		showResults = true;
		fetchSearch().then(([v, c]) => {
			vods = v;
			clips = c;
		});
	}

	search();

	// keyboard navigation for search results
	function handleResultsList(e) {
		let resultItems = document.querySelectorAll('.result-item');
		if (e.keyCode == 13 && searchFocus === -1) {
			window.location.href = `/search/${query}`;
		} else if (e.keyCode == 40) {
			searchFocus++;
			addActive(resultItems);
		} else if (e.keyCode == 38) {
			searchFocus--;
			addActive(resultItems);
		} else if (e.keyCode == 13) {
			if (searchFocus > -1) {
				if (resultItems) resultItems[searchFocus].click();
			}
		}
	}

	function addActive(resultItems) {
		if (!resultItems) return false;
		removeActive(resultItems);
		if (searchFocus >= resultItems.length) searchFocus = 0;
		if (searchFocus < 0) searchFocus = resultItems.length - 1;
		resultItems[searchFocus].classList.add('result-item-active');
	}

	function removeActive(resultItems) {
		for (let i = 0; i < resultItems.length; i++) {
			resultItems[i].classList.remove('result-item-active');
		}
	}
</script>

<Head updated_time={statsDB?.last_vod_sync} />

<header>
	<nav class="navbar navbar-expand-lg sticky-top mb-4">
		<div class="container-fluid">
			<a href="/" class="navbar-brand ps-3">
				<img src="/favicon.ico" width="50" height="50" class="rounded-circle" alt="wubPog" />
			</a>
			<button
				class="navbar-toggler me-3"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#navbarSupportedContent"
				aria-controls="navbarSupportedContent"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon" />
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item dropdown">
						<a
							class="nav-link dropdown-toggle fs-5"
							id="navbarVodsDropdown"
							role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Vods
						</a>
						<ul class="dropdown-menu" aria-labelledby="navbarVodsDropdown">
							<li><a href="/vods/all" class="dropdown-item">Alle Vods</a></li>
							<li><a href="/vods/years" class="dropdown-item">Jahresansicht</a></li>
						</ul>
					</li>
					<li class="nav-item dropdown">
						<a
							class="nav-link dropdown-toggle fs-5"
							id="navbarClipsDropdown"
							role="button"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Clips
						</a>
						<ul class="dropdown-menu" aria-labelledby="navbarClipsDropdown">
							<a href="/clips/all" class="dropdown-item">Alle Clips</a>
							<a href="/clips/top30" class="dropdown-item">Top 30 Tage</a>
						</ul>
					</li>
					<li class="nav-item">
						<a href="/stats" class="nav-link fs-5">Stats</a>
					</li>
				</ul>
				<div class="d-flex input-group w-25 me-2" autocomplete="off">
					<input
						id="searchInput"
						class="form-control rounded-0 rounded-start"
						type="search"
						placeholder="Suche /"
						aria-label="Suche"
						name="q"
						bind:value={query}
						on:input={() => search()}
						on:focus={() => (showResults = true)}
						on:keydown={(e) => handleResultsList(e)}
						required
					/>
					<button
						href="/search/{query}"
						class="btn btn-outline-secondary rounded-0 rounded-end"
						type="button">Suche</button
					>
					<div id="searchResults" class="{showResults ? '' : 'd-none'} rounded">
						{#if vods?.results.length && query?.length > 2}
							<h5 class="p-2">Vod Ergebnisse: {vods.count}</h5>
							<div id="result-items-vods">
								{#each vods.results as vod}
									<div
										class="result-item"
										on:click={() => (window.location.href = `/vods/watch/${vod.uuid}`)}
										on:mouseenter={(e) => e.target.classList.add('result-item-active')}
										on:mouseleave={(e) => e.target.classList.remove('result-item-active')}
									>
										<div class="fw-bold">{vod.title}</div>
										<div class="text-muted">
											{formatDistance(parseISO(vod.date), new Date(), { locale: de })} - {format(
												parseISO(vod.date),
												'HH:mm'
											)} Uhr
										</div>
									</div>
								{/each}
							</div>
						{/if}
						{#if clips?.results.length && query?.length > 2}
							<h5 class="p-2">Clip Ergebnisse: {clips.count}</h5>
							<div id="result-items-clips">
								{#each clips?.results as clip}
									<div
										class="result-item"
										on:click={() => (window.location.href = `/clips/watch/${clip.uuid}`)}
										on:mouseenter={(e) => e.target.classList.add('result-item-active')}
										on:mouseleave={(e) => e.target.classList.remove('result-item-active')}
									>
										<div class="fw-bold">{clip.title}</div>
										<div class="text-muted">
											{formatDistance(parseISO(clip.date), new Date(), { locale: de })}, von {clip.creator},
											{clip.view_count} Views
										</div>
									</div>
								{/each}
							</div>
						{/if}
						{#if (vods?.results.length === 0 && clips?.results.length === 0) || query?.length <= 2}
							<div class="p-2">Keine Ergebnisse</div>
						{/if}
					</div>
				</div>
				<div class="dropdown me-2">
					<button
						class="btn btn-secondary dropdown-toggle"
						type="button"
						id="dropdownTheme"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						Theme
					</button>
					<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownTheme">
						<li><div class="dropdown-item">Dark</div></li>
						<li><div class="dropdown-item">Light</div></li>
						<li><div class="dropdown-item">System</div></li>
					</ul>
				</div>
			</div>
		</div>
	</nav>
</header>

<slot />

<Footer {statsDB} />

<style lang="scss" global>
	@import '../main.scss';

	nav {
		border-bottom: var(--border) !important;
	}

	.navbar {
		background-color: var(--bg-color);
	}

	.navbar-collapse {
		background-color: var(--bg-color);
	}

	.nav-link {
		color: var(--main-color) !important;
	}

	.form-control {
		color: var(--main-color) !important;
		border: var(--border);

		&:focus,
		&:focus-visible {
			color: inherit;
			border-color: inherit;
			box-shadow: none;
		}
	}

	#searchResults {
		position: absolute;
		z-index: 1000;
		background-color: var(--bg-color);
		border: 1px solid var(--main-color);
		top: 0;
		margin-top: 37px;
		width: 100%;

		h5 {
			margin: 0;
			background-color: var(--main-color);
			color: var(--bg-color);
		}

		.result-item {
			padding: 0.5em;
			cursor: pointer;

			&:not(:last-child) {
				border-bottom: 1px solid var(--accent-color);
			}
		}
	}
</style>
