<script>
    import { onMount, onDestroy } from 'svelte';

    import videojs from 'video.js';
    import 'video.js/dist/video-js.css';
    import 'videojs-seek-buttons';
    import 'videojs-seek-buttons/dist/videojs-seek-buttons.css';

    export let obj;
    export let type;
    export let time;

    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
    let player;
    let watched = JSON.parse(localStorage.getItem('watched'));
    if (!watched) {
        watched = {
            vods: {},
            clips: {}
        };
    }
    let playerSettings = JSON.parse(localStorage.getItem('player'));
    if (!playerSettings) {
        playerSettings = {
            volume: 1,
            playbackRate: 1
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
            },
            playbackRates: playbackRates
        };
        player = videojs('vod', options);
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
        player.on('loadedmetadata', () => {
            player.playbackRate(playerSettings.playbackRate);
            player.volume(playerSettings.volume);
            if (time > 0) {
                player.currentTime(time);
            } else if (watched[type][obj.uuid]) {
                player.currentTime(watched[type][obj.uuid]);
            }
        })
        player.on('timeupdate', () => {
            updateWatched();
        });
        player.on('volumechange', () => {
            updatePlayerSettings();
        });
        player.on('ratechange', () => {
            console.log(player.playbackRate());
            updatePlayerSettings();
        });
        player.play();

        document.onkeydown = (e) => {
            let searchActive = document.getElementById("searchInput") == document.activeElement;
            if (searchActive) {
                return
            } else if (e.key === "f") {
                if (player.isFullscreen()) {
                    player.exitFullscreen();
                } else {
                    player.requestFullscreen();
                }
                return false
            } else if (e.key === " ") {
                if (player.paused()) {
                    player.play();
                } else {
                    player.pause();
                }
                return false
            } else if (e.key === "ArrowRight") {
                player.currentTime(player.currentTime() + 30)
                return false
            } else if (e.key === "ArrowLeft") {
                player.currentTime(player.currentTime() - 10)
                return false
            } else if (e.key === "ArrowUp") {
                player.volume(player.volume() + 0.05)
                return false
            } else if (e.key === "ArrowDown") {
                player.volume(player.volume() - 0.05)
                return false
            } else if (e.key === "m") {
                if (player.muted()) {
                    player.muted(false)
                } else {
                    player.muted(true)
                }
                return false
            } else if (e.key === ",") {
                let rateIndex = playbackRates.indexOf(player.playbackRate())
                if (rateIndex-1 >= 0 && rateIndex-1 <= playbackRates.length) {
                    player.playbackRate(playbackRates[rateIndex-1])
                }
                return false
            } else if (e.key === ".") {
                let rateIndex = playbackRates.indexOf(player.playbackRate())
                if (rateIndex+1 >= 0 && rateIndex+1 <= playbackRates.length) {
                    player.playbackRate(playbackRates[rateIndex+1])
                }
                return false
            }
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
            time = Math.round(player.currentTime());
            watched[type][obj.uuid] = time;
            localStorage.setItem('watched', JSON.stringify(watched));
        }
    }

    function updatePlayerSettings() {
        playerSettings.volume = player.volume();
        playerSettings.playbackRate = player.playbackRate();
        localStorage.setItem('player', JSON.stringify(playerSettings));
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
>
    <p class="vjs-no-js">
        To view this video please enable JavaScript, and consider upgrading to a web browser that
        <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
    </p>
    <track kind="captions" />
</video>
