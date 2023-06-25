let wakeLock = null;

const requestWakeLock = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        wakeLock.addEventListener('release', () => {
            console.log('Wake Lock was released');
        });
        console.log('Wake Lock is active');
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
};

const releaseWakeLock = async () => {
    if (wakeLock !== null) {
        await wakeLock.release();
        wakeLock = null;
    }
};

window.onload = function() {
    const checkbox = document.querySelector('#screenLock');
    checkbox.addEventListener('change', (event) => {
        if (event.target.checked) {
            requestWakeLock();
        } else {
            releaseWakeLock();
        }
    });
}
