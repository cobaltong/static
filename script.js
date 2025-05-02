let audioContext = null;
let whiteNoiseSource = null;
let isPlaying = false;
const sampleRate = 6942; // nice number! lower pitched, less harsh white noise.
const bufferSize = 600 * sampleRate; // with the original samplerate this would be 10 minutes, considerably more now

document.getElementById('toggleNoise').addEventListener('click', togglePlayback);

// turns noise on and off upon pressing the button
function togglePlayback() {
    const button = document.getElementById('toggleNoise');

    if (!audioContext) {
      // most browsers won't play audio on a page if the user hasn't made an input, so we need to do this
      // blame the obnoxious pages of the early 2000s for making it that way, lmao
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1; // grabs random numbers to turn into frequencies
        whiteNoiseSource = audioContext.createBufferSource();
        whiteNoiseSource.buffer = noiseBuffer;
        whiteNoiseSource.loop = true;
        whiteNoiseSource.connect(audioContext.destination);
        // Start the source immediately, it will play once the context is running
        whiteNoiseSource.start();
    }

    if (isPlaying) {
        // still using suspend n resume here for consistency and minimal variables, it was coded to stop upon exiting the tab. It no longer does this.
        audioContext.suspend().then(() => {
            button.textContent = 'Start Noise';
            isPlaying = false;
            console.log('AudioContext suspended.');
        });
    } else {
        // If not playing, resume the context
        audioContext.resume().then(() => {
            button.textContent = 'Stop Noise';
            isPlaying = true;
            console.log('AudioContext resumed.');
        });
    }
}
