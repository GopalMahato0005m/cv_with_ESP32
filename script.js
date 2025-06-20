const URL = "https://teachablemachine.withgoogle.com/models/Jvgd18jdG/";

let recognizer;
let lastDetected = "";
let isListening = false;

async function createModel() {
    const checkpointURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    recognizer = speechCommands.create("BROWSER_FFT", undefined, checkpointURL, metadataURL);
    await recognizer.ensureModelLoaded();
}

async function init() {
    if (!recognizer) await createModel();
    if (isListening) return;

    const labels = recognizer.wordLabels();

    recognizer.listen(result => {
        const scores = result.scores;
        const maxScore = Math.max(...scores);
        const classIndex = scores.indexOf(maxScore);
        const currentDetected = labels[classIndex];

        if (maxScore > 0.75 && currentDetected !== lastDetected) {
            lastDetected = currentDetected;
            document.getElementById("current-label").textContent = `Detected: ${currentDetected}`;
        }
    }, {
        probabilityThreshold: 0.75,
        overlapFactor: 0.5,
        invokeCallbackOnNoiseAndUnknown: false
    });

    isListening = true;

    // Update button styles
    document.getElementById("start-btn").classList.add("active-start");
    document.getElementById("stop-btn").classList.remove("active-stop");
}

function stop() {
    if (recognizer && isListening) {
        recognizer.stopListening();
        document.getElementById("current-label").textContent = "Detection stopped.";
        isListening = false;

        // Update button styles
        document.getElementById("start-btn").classList.remove("active-start");
        document.getElementById("stop-btn").classList.add("active-stop");
    }
}
