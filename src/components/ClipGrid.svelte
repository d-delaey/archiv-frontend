<script>
    import VideoThumbnail from './VideoThumbnail.svelte';
    import { formatDistance, parseISO } from 'date-fns';
    import { de } from 'date-fns/locale/index.js';

    export let clips;
</script>

<div class="row">
    {#each clips.results as clip, i}
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-2 mb-2">
            <div class="card card-rounded h-100">
                <div class="position-relative">
                    <VideoThumbnail
                        type="clips"
                        filename={clip.clip_id}
                        title={clip.title}
                        uuid={clip.uuid}
                        duration={clip.duration}
                        loading={i > 7 ? 'lazy' : 'auto'}
                    />
                </div>
                <div class="card-body">
                    <a href="/clips/watch/{clip.uuid}">
                        <p class="h5 m-0 emote-title">
                            {clip.title}
                        </p>
                    </a>
                    <p class="card-text text-muted">
                        {formatDistance(parseISO(clip.date), new Date(), { locale: de })}<br />
                        {clip.view_count} Views - {clip.creator}
                    </p>
                </div>
            </div>
        </div>
    {:else}
        <div class="col">
            <img src="/img/modcheck.gif" alt="modcheck" width="110" height="110" />
        </div>
    {/each}
</div>
