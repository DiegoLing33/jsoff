export default function setupErrorElement(){

    const $appError = document.querySelector(".app-error");
    const $appErrorContent = document.querySelector(".app-error>.content");
    const $appClose = document.querySelector(".app-close");
    const $appMove = document.querySelector(".app-move");

    let savedHeight = 0;
    let startMouseY = 0;

    $appMove.onmousedown = (e) => {
        savedHeight = parseInt($appError.style['height'].replace('px', ''));
        startMouseY = e.clientY + savedHeight;

        function onMove(e){
            savedHeight = startMouseY - e.clientY;

            if(savedHeight > 500) {
                $appError.onmouseup();
                return;
            }
            if(savedHeight <= 30) {
                $appError.onmouseup();
                setVisibleError(false);
                return;
            }
            $appError.style['height'] = savedHeight + 'px';
        }

        document.addEventListener("mousemove", onMove);
        $appError.onmouseup = () => {
            document.removeEventListener("mousemove", onMove);
            $appError.onmouseup = null;
        }
    };

    $appMove.ondragstart = () => false;

    $appClose.onclick = () => setVisibleError(false);

    /**
     * Prints error
     * @param text
     */
    function printError(text){
        $appErrorContent.innerText = text;
        setVisibleError(true);
    }

    /**
     * Sets visibility of the error element
     * @param flag
     */
    function setVisibleError(flag){
        $appError.style['display'] = flag ? 'block' : 'none';
        if(flag && savedHeight <= 30){
            $appError.style['height'] = '130px';
        }
    }

    return {
        printError,
        setVisibleError,
    }
}