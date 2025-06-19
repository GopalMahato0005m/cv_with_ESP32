const URL = "https://teachablemachine.withgoogle.com/models/ogymsf3mV/"; // Replace with your model URL

let recognizer;
let lastDetected = "";

async function createModel() {
    const checkpointURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    recognizer = speechCommands.create(
        "BROWSER_FFT",
        undefined,
        checkpointURL,
        metadataURL
    );

    await recognizer.ensureModelLoaded();
}

async function init() {
    await createModel();
    const labels = recognizer.wordLabels(); // [Left, Right, Front, Back, Stop,...]

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
}
