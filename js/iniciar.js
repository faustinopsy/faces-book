$(document).ready(() => {
    run();
})
async function run() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    await faceapi.nets.ssdMobilenetv1.loadFromUri("./models")
    await faceapi.nets.faceLandmark68Net.loadFromUri("./models")
    await faceapi.nets.faceRecognitionNet.loadFromUri("./models")
    await faceapi.nets.faceExpressionNet.loadFromUri("./models")
	await faceapi.nets.ageGenderNet.loadFromUri("./models") 
}