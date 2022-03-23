<script>
    import VideoThumbnail from '../../../components/VideoThumbnail.svelte';
    import Player from '../../../components/Player.svelte';
    import { page } from '$app/stores';
    import { format, parseISO } from 'date-fns';

    let uuid;

    page.subscribe(() => {
        uuid = $page.params.uuid;
    });

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    async function fetchVod(vod_uuid) {
        const response = await fetch(`${BASE_URL}/api/vods/${vod_uuid}`);
        const v = await response.json();
        return v;
    }

    async function fetchClip(clip_uuid) {
        const response = await fetch(`${BASE_URL}/api/clips/${clip_uuid}`);
        const c = await response.json();
        return c;
    }

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
</script>

<main class="flex-shrink-0">
    {#await fetchVod(uuid)}
        <div class="container">
            <div class="mb-4">
                <div class="row">
                    <div class="col-12 ratio ratio-16x9">
                        <svg
                            class="bd-placeholder-img "
                            width="100%"
                            xmlns="http://www.w3.org/2000/svg"
                            role="img"
                            aria-label="Placeholder"
                            preserveAspectRatio="xMidYMid slice"
                            focusable="false"
                        >
                            <title>Placeholder</title>
                            <rect width="100%" height="100%" fill="#222222" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="mb-4">
                <div>
                    <p class="placeholder-glow display-6">
                        <span class="placeholder col-3" />
                        <span class="placeholder col-7" />
                    </p>
                    <p class="text-muted placeholder-glow">
                        <span class="placeholder col-4" />
                    </p>
                </div>
            </div>
        </div>
    {:then vod}
        <div class="container">
            <div class="mb-4">
                <div class="row">
                    <div class="col-12">
                        <Player obj={vod} type="vods" />
                    </div>
                </div>
            </div>
            <div class="vod-infos mb-4">
                <div class="d-flex title-container">
                    <div>
                        <p class="display-6 fw-bolder emote-title large">
                            {vod.title}
                        </p>
                        <p class="text-muted">
                            {format(parseISO(vod.date), 'dd.MM.yyyy - HH:mm')} Uhr
                        </p>
                    </div>
                    <div class="share-button">
                        <div class="dropdown">
                            <button
                                class="btn btn-sm dropdown-toggle"
                                type="button"
                                id="share-button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Teilen
                            </button>
                            <ul
                                class="dropdown-menu dropdown-menu-end p-3 share-button-list"
                                id="share-button-list"
                                aria-labelledby="share-button"
                                style="width: max-content;"
                            >
                                <li>
                                    <div class="input-group">
                                        <input
                                            type="text"
                                            class="form-control share-input"
                                            aria-label="Share Url"
                                        />
                                        <button id="btn-copy-clipboard" class="btn">
                                            <svg
                                                id="icon-clipboard"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                class="bi bi-clipboard"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
                                                />
                                                <path
                                                    d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
                                                />
                                            </svg>
                                            <svg
                                                id="icon-clipboard-checked"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                fill="currentColor"
                                                class="bi bi-clipboard-check"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                                                />
                                                <path
                                                    d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"
                                                />
                                                <path
                                                    d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <div class="form-check mt-2">
                                        <input
                                            class="form-check-input"
                                            type="checkbox"
                                            id="share-checkbox"
                                        />
                                        <label
                                            class="form-check-label"
                                            for="share-checkbox"
                                            id="share-at-text"
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div>
                    <p class="collapse text-muted" id="collapseExample">
                        Auslösung: {vod.resolution}<br />
                        Bitrate: {formatBytes(vod.bitrate)}it/s<br />
                        FPS: {vod.fps}<br />
                        Größe: {formatBytes(vod.size)}
                    </p>
                    <p class="lh-lg">
                        <button
                            class="btn btn-sm"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseExample"
                            aria-expanded="false"
                            aria-controls="collapseExample"
                        >
                            Mehr anzeigen
                        </button>
                        <a href="/vods/watch/{vod.uuid}?dl=1" class="btn btn-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-download"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
                                />
                                <path
                                    d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
                                />
                            </svg>
                            Download
                        </a>
                        <button
                            type="button"
                            class="btn btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#hotkeyModal"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-keyboard"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    d="M14 5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12zM2 4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"
                                />
                                <path
                                    d="M13 10.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm0-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5 0A.25.25 0 0 1 8.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 8 8.75v-.5zm2 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-.5zm1 2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-5-2A.25.25 0 0 1 6.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 6 8.75v-.5zm-2 0A.25.25 0 0 1 4.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 4 8.75v-.5zm-2 0A.25.25 0 0 1 2.25 8h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 2 8.75v-.5zm11-2a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm-2 0A.25.25 0 0 1 9.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 9 6.75v-.5zm-2 0A.25.25 0 0 1 7.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 7 6.75v-.5zm-2 0A.25.25 0 0 1 5.25 6h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5A.25.25 0 0 1 5 6.75v-.5zm-3 0A.25.25 0 0 1 2.25 6h1.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-1.5A.25.25 0 0 1 2 6.75v-.5zm0 4a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-.5zm2 0a.25.25 0 0 1 .25-.25h5.5a.25.25 0 0 1 .25.25v.5a.25.25 0 0 1-.25.25h-5.5a.25.25 0 0 1-.25-.25v-.5z"
                                />
                            </svg>
                            Hotkeys
                        </button>
                    </p>
                </div>
                {#if vod.clip_set.length}
                    <hr class="my-4" />
                    <p class="display-6 fw-bolder emote-title large">Clips für dieses Vod:</p>
                    <div class="row">
                        {#each vod.clip_set as uuid}
                            {#await fetchClip(uuid)}
                                <p>Lade Clip...</p>
                            {:then clip}
                                <div
                                    class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2"
                                >
                                    <div class="position-relative">
                                        <VideoThumbnail
                                            type="clips"
                                            filename={clip.clip_id}
                                            title={clip.title}
                                            uuid={clip.uuid}
                                            duration={clip.duration}
                                            loading={'auto'}
                                        />
                                    </div>
                                    <div class="card-body">
                                        <a href="/clips/watch/{clip.uuid}">
                                            <p class="h5 m-0 emote-title">
                                                {clip.title}
                                            </p>
                                        </a>
                                        <p class="card-text text-muted">
                                            {format(parseISO(vod.date), 'dd.MM.yyyy - HH:mm')} Uhr<br
                                            />
                                            {clip.view_count} Views - {clip.creator}
                                        </p>
                                    </div>
                                </div>
                            {/await}
                        {/each}
                    </div>
                    <hr class="my-4" />
                {/if}
            </div>
            <script
                src="https://utteranc.es/client.js"
                repo="AgileProggers/wubbl0rz-archiv-comments"
                issue-term="url"
                theme="preferred-color-scheme"
                crossorigin="anonymous"
                async>
            </script>
        </div>
    {/await}
</main>

<style lang="scss">
    .share-input {
        padding: 0.25rem 0.5rem;
    }

    .share-button-list {
        background-color: var(--hover-color);
        width: 450px !important;
        max-width: 100vw;
    }

    .share-button {
        margin-left: auto;
    }

    @media screen and (max-width: 767px) {
        .title-container {
            display: block !important;
        }

        .share-button {
            margin: 1rem 0;
        }
    }
</style>
