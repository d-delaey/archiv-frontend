<script>
    import { onMount, onDestroy } from 'svelte';

    import videojs from 'video.js';
    import 'video.js/dist/video-js.css';
    import 'videojs-seek-buttons';
    import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';

    export let obj;
    export let type;

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const playbackRates = {
        playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    };
    let player;
    let currentTime;
    let watched = JSON.parse(localStorage.getItem('watched'));
    if (!watched) {
        watched = {
            vods: {},
            clips: {}
        };
    }
    let src =
        type === 'vods'
            ? `${BASE_URL}/media/${type}/${obj.filename}-segments/${obj.filename}.m3u8`
            : `${BASE_URL}/media/${type}/${obj.clip_id}-segments/${obj.clip_id}.m3u8`;
    let poster =
        type === 'vods'
            ? `${BASE_URL}/media/${type}/${obj.filename}-lg.jpg`
            : `${BASE_URL}/media/${type}/${obj.clip_id}-lg.jpg`;

    onMount(() => {
        let options = {
            controlBar: {
                volumePanel: {
                    inline: false
                }
            }
        };
        player = videojs('vod', options);
        player.setAttribute('uuid', obj.uuid);
        player.src({
            src: src,
            type: 'application/x-mpegURL'
        });
        player.fluid(true);
        player.seekButtons({
            forward: 30,
            back: 10
        });
        // Safari has problems with bind:currentTime on the video element and running a function when the var changes. So we use the non svelte way.
        // https://github.com/sveltejs/svelte/issues/6002
        player.on("timeupdate", () => {
            updateWatched()
        })
        player.play();

        if (watched[type][obj.uuid]) {
            player.currentTime(watched[type][obj.uuid]);
        }

    });

    onDestroy(() => {
        player.dispose();
    });

    function updateWatched() {
        if (watched[type][obj.uuid] === undefined) {
            watched[type][obj.uuid] = 0;
            localStorage.setItem('watched', JSON.stringify(watched));
        } else if (Math.floor(player.currentTime()) != Math.floor(watched[type][obj.uuid])) {
            watched[type][obj.uuid] = Math.round(player.currentTime());
            localStorage.setItem('watched', JSON.stringify(watched));
        }
    }
</script>

<video
    id="vod"
    class="video-js vjs-big-play-centered"
    controls
    preload="none"
    width="100%"
    height="100%"
    {poster}
    data-setup={JSON.stringify(playbackRates)}
>
    <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
    </p>
    <track kind="captions" />
</video>
