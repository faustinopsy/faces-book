const form = document.querySelector("#detectar-emocoes-form");
let resultsContainer = document.querySelector("#detectar-emocoes-results");
let resultsidade = document.querySelector("#detectar-emocoes-idade");
let pontos = document.querySelector("#pontos");
const sourceSwitch = document.getElementById("detectar-emocoes-source-switch");
let stream;

let startCameraButton = document.getElementById("start-camera-button");
let detectEmotionsButton = document.getElementById("detect-emotions-button");
let detectLandmarksButton = document.getElementById("detect-landmarks-button");
let detectAgeButton = document.getElementById("detect-age-button");
let extractPointsButton = document.getElementById("extract-points-button");

let displaySize;
let detections;
let resizedDetections;

let canvas = document.createElement("canvas");  
resultsContainer.appendChild(canvas);

let startCameraInterval;
    detectEmotionsButton.disabled = true;
    detectLandmarksButton.disabled = true;
    detectAgeButton.disabled = true;
    extractPointsButton.disabled = true;
startCameraButton.addEventListener("change", async (event) => {
  if (event.target.checked) {
    detectEmotionsButton.disabled = false;
    detectLandmarksButton.disabled = false;
    detectAgeButton.disabled = false;
    extractPointsButton.disabled = false;

        detectEmotionsButton.addEventListener("change", detectEmotionsButton);
        detectLandmarksButton.addEventListener("change", detectLandmarksButton);
        detectAgeButton.addEventListener("change", detectAgeButton);
        extractPointsButton.addEventListener("change", extractPointsButton);
        resultsContainer.innerHTML = "";
        video = document.createElement("video");
        video.width = 200;
        video.height = 150;
        video.autoplay = true;
        stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
        });
       
        canvas.width = video.width;
        canvas.height = video.height;
        canvas.id = "landmarkCanvas";
        video.srcObject = stream;
        resultsContainer.appendChild(video);
        resultsContainer.appendChild(canvas);
    } else {
        detectEmotionsButton.checked = false;
        detectEmotionsButton.disabled = true;
        detectLandmarksButton.checked = false;
        detectLandmarksButton.disabled = true;
        detectAgeButton.checked = false;
        detectAgeButton.disabled = true;
        extractPointsButton.checked = false;
        extractPointsButton.disabled = true;

        detectEmotionsButton.removeEventListener("change", detectEmotionsButton);
        detectLandmarksButton.removeEventListener("change", detectLandmarksButton);
        detectAgeButton.removeEventListener("change", detectAgeButton);
        extractPointsButton.removeEventListener("change", extractPointsButton);

        clearInterval(detectLandmarksInterval);
        clearInterval(detectEmotionsInterval);
        clearInterval(detectAgeInterval);
        clearInterval(extractPointsInterval);
        resultsContainer.innerHTML = "";
        video.srcObject = null;
        if (stream != null) {
        stream.getTracks().forEach((track) => track.stop());
        }
    }
    });

    let detectEmotionsInterval;

detectEmotionsButton.addEventListener("change", async (event) => {
  if (event.target.checked) {
    detectEmotionsInterval = setInterval(async () => {
        canvas = document.getElementById("landmarkCanvas");
        displaySize = { width: video.width, height: video.height};
        faceapi.matchDimensions(canvas,displaySize);
        detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        resizedDetections = faceapi.resizeResults(detections, displaySize);

        resultsContainer.innerHTML = "";
        resultsContainer.appendChild(video);
        resultsContainer.appendChild(canvas);
        detections.forEach((result) => {
            if (result.expressions) {
            const happy = result.expressions.Feliz || 0;
            const sad = result.expressions.Triste || 0;
            const angry = result.expressions.Raiva || 0;
            const disgusted = result.expressions.Nojo || 0;
            const fear = result.expressions.Medo || 0;
            const surprise = result.expressions.Surpreso || 0;
            const neutr = result.expressions.Neutro || 0;
            const card = document.createElement("div");
            card.innerHTML = `<h3>Emoções detectadas:</h3> <ul> 
            <li>Neutro: ${neutr.toFixed(2)}</li> 
            <li>Felicidade: ${happy.toFixed(2)}</li> 
            <li>Tristeza: ${sad.toFixed(2)}</li> 
            <li>Raiva: ${angry.toFixed(2)}</li> 
            <li>Desprezo: ${disgusted.toFixed(2)}</li> 
            <li>Medo: ${fear.toFixed(2)}</li> 
            <li>Surpresa: ${surprise.toFixed(2)}</li> 
            </ul>`;
            resultsContainer.appendChild(card);
            } else {
            console.error("Nenhuma emoção detectada.");
            }
        }); 
        }, 500)
    } else {
        clearInterval(detectEmotionsInterval);
    }
    });
    
        let detectLandmarksInterval;
        function unite(leftEyebrow, rightEyebrow) {
            const united = [];
          
            for (const point of leftEyebrow) {
              united.push(point);
            }
          
            for (const point of rightEyebrow) {
              united.push(point);
            }
          
            return united;
          }
          
        detectLandmarksButton.addEventListener("change", async (event) => {
            if (event.target.checked) {
              detectLandmarksInterval = setInterval(async () => {
                canvas = document.getElementById("landmarkCanvas");
                displaySize = { width: video.width, height: video.height};
                faceapi.matchDimensions(canvas,displaySize);
                detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
                resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height);
          
                for (const detection of resizedDetections) {
                  const landmarks = detection.landmarks;
                  const leftEyebrow = landmarks.getLeftEyeBrow();
                  const rightEyebrow = landmarks.getRightEyeBrow();
                  faceapi.draw.drawFaceLandmarks(canvas, detection, {
                    drawLines: true,
                    color: 'red',
                    landmarkIndices: leftEyebrow.concat(rightEyebrow)
                  });
                  faceapi.draw.drawFaceLandmarks(canvas, detection, {
                    drawLines: true,
                    color: 'yellow',
                    landmarkIndices: leftEyebrow.concat(rightEyebrow)
                  });
                }
          
                resultsContainer.innerHTML = "";
                resultsContainer.appendChild(video);
                resultsContainer.appendChild(canvas);
              }, 500)
            } else {
              clearInterval(detectLandmarksInterval);
            }
          });
          

        let detectAgeInterval;

    detectAgeButton.addEventListener("change", async (event) => {
      if (event.target.checked) {
        detectAgeInterval = setInterval(async () => {
        canvas = document.getElementById("landmarkCanvas");
        displaySize = { width: video.width, height: video.height};
        faceapi.matchDimensions(canvas,displaySize);
        detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender();
        resizedDetections = faceapi.resizeResults(detections, displaySize);
        resultsidade.innerHTML = "";
        resultsidade.appendChild(video);
        resultsidade.appendChild(canvas);
        detections.forEach((result) => {
          if (result.age) {
              const card = document.createElement("div");
              card.innerHTML = `<h3>Idade detectada:</h3> <p>${result.age.toFixed(0)} anos</p>`;
              resultsidade.appendChild(card);
              } else {
              console.error("Nenhuma idade detectada.");
          }
        });
      }, 500)
    } else {
        clearInterval(detectAgeInterval);
    }
    });

    let extractPointsInterval;

    extractPointsButton.addEventListener("change", async (event) => {
      if (event.target.checked) {
        extractPointsInterval = setInterval(async () => {
        canvas = document.getElementById("landmarkCanvas");
        displaySize = { width: video.width, height: video.height};
        faceapi.matchDimensions(canvas,displaySize);
        detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        resizedDetections = faceapi.resizeResults(detections, displaySize);
        resultsContainer.appendChild(video);
        resultsContainer.appendChild(canvas);

    function getBoxFromPoints(points) {
        const box = {
        bottom: -Infinity,
        left: Infinity,
        right: -Infinity,
        top: Infinity,
        get center() {
            return {
            x: this.left + this.width / 2,
            y: this.top + this.height / 2,
            };
        },
        get height() {
        return this.bottom - this.top;
        },
        get width() {
        return this.right - this.left;
        },
        };

        for (const point of points) {
            box.left = Math.min(box.left, point.x);
            box.right = Math.max(box.right, point.x);
            box.bottom = Math.max(box.bottom, point.y);
            box.top = Math.min(box.top, point.y);
        }

        return box;
    }

    for (const face of resizedDetections) {
        const features = {
            mandibula: face.landmarks.positions.slice(0, 17),
            sobrancelhaesquerda: face.landmarks.positions.slice(17, 22),
            sobrancelhaDireita: face.landmarks.positions.slice(22, 27),
            Pontenasal: face.landmarks.positions.slice(27, 31),
            nariz: face.landmarks.positions.slice(31, 36),
            olhoEsquerdo: face.landmarks.positions.slice(36, 42),
            olhoDireito: face.landmarks.positions.slice(42, 48),
            labioExterno: face.landmarks.positions.slice(48, 60),
            labiointerno: face.landmarks.positions.slice(60),
        };
    
        const pre = document.createElement("pre");
        pre.innerText = JSON.stringify(features, null, 2);
        pontos.innerHTML = "";
        // Adicionar o elemento `pre` ao `resultsContainer`
        pontos.appendChild(pre);
        
        for (const eye of [features.olhoEsquerdo, features.olhoDireito]) {
            const eyeBox = getBoxFromPoints(eye);
            const fontSize = 20;
            const context = canvas.getContext("2d");
            context.lineWidth = 2;
            context.fillStyle = "#FF0000";
            context.beginPath();
            context.fillStyle = "rgba(20,30,22,0.3)";
            context.strokeRect(eyeBox.center.x-10, eyeBox.center.y-10, 30, 20, 30 );
            context.arc(eyeBox.center.x, eyeBox.center.y, 5, 0, 2 * Math.PI);
            context.fillStyle = "rgba(255, 255, 255, 0)";
            context.fill();
            context.closePath();
            context.fill();
        }
    }
    
}, 500)
} else {
    clearInterval(extractPointsInterval);
}
});