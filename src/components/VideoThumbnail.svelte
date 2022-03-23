<script>
	export let type;
	export let filename;
	export let title;
	export let uuid;
	export let duration;
	export let loading;

	const BASE_URL = import.meta.env.VITE_BASE_URL;

	function showPrev() {
		document.getElementById(
			filename + '-sm-avif'
		).srcset = `${BASE_URL}/media/${type}/${filename}-preview.webp`;
		document.getElementById(
			filename + '-md-avif'
		).srcset = `${BASE_URL}/media/${type}/${filename}-preview.webp`;
	}

	function hidePrev() {
		document.getElementById(
			filename + '-sm-avif'
		).srcset = `${BASE_URL}/media/${type}/${filename}-sm.avif`;
		document.getElementById(
			filename + '-md-avif'
		).srcset = `${BASE_URL}/media/${type}/${filename}-md.avif`;
	}

	function toHHMMSS() {
		const sec_num = parseInt(duration, 10);
		let hours = Math.floor(sec_num / 3600);
		let minutes = Math.floor((sec_num - hours * 3600) / 60);
		let seconds = sec_num - hours * 3600 - minutes * 60;
		let h = hours < 10 ? '0' + hours : hours;
		let m = minutes < 10 ? '0' + minutes : minutes;
		let s = seconds < 10 ? '0' + seconds : seconds;
		return h + ':' + m + ':' + s;
	}
</script>

<a href="/{type}/watch/{uuid}">
	<!-- https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/mouse-events-have-key-events.md -->
	<picture
		id={filename}
		class="has-preview"
		on:mouseover={() => showPrev()}
		on:focus={() => showPrev()}
		on:mouseout={() => hidePrev()}
		on:blur={() => hidePrev()}
	>
		<source
			id="{filename}-sm-avif"
			type="image/avif"
			srcset="{BASE_URL}/media/{type}/{filename}-sm.avif"
			media="(min-width: 576px)"
			class="card-img-top image-rounded-top"
			alt={title}
			{loading}
		/>
		<source
			id="{filename}-md-avif"
			type="image/avif"
			srcset="{BASE_URL}/media/{type}/{filename}-md.avif"
			media="(max-width: 575px)"
			class="card-img-top image-rounded-top"
			alt={title}
			{loading}
		/>
		<img
			width="520"
			height="293"
			id="{filename}-jpg"
			srcset="{BASE_URL}/media/{type}/{filename}-sm.jpg 576w, {BASE_URL}/media/{type}/{filename}-md.jpg 575w"
			src="{BASE_URL}/media/{type}/{filename}-md.jpg"
			class="card-img-top image-rounded-top"
			alt={title}
			{loading}
		/>
	</picture>
	<div class="timecode-overlay text-white">
		{toHHMMSS()}
	</div>
	<div id="watched-progress" data-id={uuid} class="progress progress-overlay d-none">
		<div
			class="progress-bar"
			role="progressbar"
			aria-label="{uuid}-progress"
			aria-valuenow="0"
			aria-valuemin="0"
			aria-valuemax={duration}
		/>
	</div>
</a>

<style lang="scss">
	.card-img-top {
		width: 100%;
		height: auto;
	}
</style>
