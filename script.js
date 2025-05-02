let audioContext = null;
let whiteNoiseSource = null;
let isPlaying = false;
const sampleRate = 44100;
const bufferSize = 2 * sampleRate; // 2 seconds of white noise

document.getElementById('toggleNoise').addEventListener('click', togglePlayback);

// Refined togglePlayback logic using suspend/resume
function togglePlayback() {
    const button = document.getElementById('toggleNoise');

    if (!audioContext) {
        // Create context and source on the first click
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        whiteNoiseSource = audioContext.createBufferSource();
        whiteNoiseSource.buffer = noiseBuffer;
        whiteNoiseSource.loop = true;
        whiteNoiseSource.connect(audioContext.destination);
        // Start the source immediately, it will play once the context is running
        whiteNoiseSource.start();
    }

    if (isPlaying) {
        // If currently playing, suspend the context
        // Using suspend/resume for consistent state management with potential future features,
        // but the visibilitychange listener that would trigger automatic suspension is removed.
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