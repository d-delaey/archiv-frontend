<script>
    export let type;
    export let filename;
    export let title;
    export let uuid;
    export let duration;

    function showPrev() {
        document.getElementById(filename + "-sm-avif").srcset = `ENV_BASE_DIR/media/${type}/${filename}-preview.webp`;
        document.getElementById(filename + "-md-avif").srcset = `ENV_BASE_DIR/media/${type}/${filename}-preview.webp`;
    }

    function hidePrev() {
        document.getElementById(filename + "-sm-avif").srcset = `ENV_BASE_DIR/media/${type}/${filename}-sm.avif`;
        document.getElementById(filename + "-md-avif").srcset = `ENV_BASE_DIR/media/${type}/${filename}-md.avif`;
    }

     function toHHMMSS() {
        const sec_num = parseInt(duration, 10);
        let hours   = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);
        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
    }
</script>

<a href="/{type}/watch/{uuid}">
    <!-- https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/mouse-events-have-key-events.md -->
    <picture id="{filename}" class="has-preview" on:mouseover={() => showPrev()} on:focus={() => showPrev()} on:mouseout={() => hidePrev()} on:blur={() => hidePrev()}>
        <source id="{filename}-sm-avif" type="image/avif" srcset="ENV_BASE_DIR/media/{type}/{filename}-sm.avif" media="(min-width: 576px)" class="card-img-top image-rounded-top" alt="{title}" loading="lazy">
        <source id="{filename}-md-avif" type="image/avif" srcset="ENV_BASE_DIR/media/{type}/{filename}-md.avif" media="(max-width: 575px)" class="card-img-top image-rounded-top" alt="{title}" loading="lazy">
        <img id="{filename}-jpg" srcset="ENV_BASE_DIR/media/{type}/{filename}-sm.jpg 576w, ENV_BASE_DIR/media/{type}/{filename}-md.jpg 575w" src="ENV_BASE_DIR/media/{type}/{filename}-md.jpg" class="card-img-top image-rounded-top" alt="{title}" loading="lazy">
    </picture>
    <div class="timecode-overlay text-white">
        {toHHMMSS()}
    </div>
    <div id="watched-progress" data-id="{uuid}" class="progress progress-overlay d-none">
        <div class="progress-bar" role="progressbar" aria-label="{uuid}-progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="{duration}"></div>
    </div>
</a>
