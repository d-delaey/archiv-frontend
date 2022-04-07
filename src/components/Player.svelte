<script>
    import { onMount, onDestroy } from 'svelte';

    import videojs from 'video.js';
    import 'video.js/dist/video-js.css';
    import 'videojs-seek-buttons';
    import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';

    export let obj;
    export let type;

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    let player;
    let src =
        type === 'vods'
            ? `${BASE_URL}/media/${type}/${obj.filename}-segments/${obj.filename}.m3u8`
            : `${BASE_URL}/media/${type}/${obj.clip_id}-segments/${obj.clip_id}.m3u8`;
    let poster =
        type === 'vods'
            ? `${BASE_URL}/media/${type}/${obj.filename}-lg.jpg`
            : `${BASE_URL}/media/${type}/${obj.clip_id}-lg.jpg`;

    const playbackRates = {
        playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    };

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
        player.play();
    });

    onDestroy(() => {
        player.dispose();
    });
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
