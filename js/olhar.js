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
let tempoDeSelecao = 2000; 
let tempoInicial;
let botaoSelecionado = null;
let extractPointsInterval;
let detectLandmarksInterval;

let startCameraInterval;
    extractPointsButton.disabled = true;


    startCameraButton.addEventListener("change", async (event) => {
    if (event.target.checked) {
        detectEmotionsButton.disabled = false;
        detectLandmarksButton.disabled = false;
        detectAgeButton.disabled = false;
        extractPointsButton.disabled = false;

        
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
        extractPointsButton.checked = false;
        extractPointsButton.disabled = true;
        detectEmotionsButton.removeEventListener("change", detectEmotionsButton);
        detectLandmarksButton.removeEventListener("change", detectLandmarksButton);
        detectAgeButton.removeEventListener("change", detectAgeButton);
        extractPointsButton.removeEventListener("change", extractPointsButton);
 
        clearInterval(extractPointsInterval);
        resultsContainer.innerHTML = "";
        video.srcObject = null;
        if (stream != null) {
        stream.getTracks().forEach((track) => track.stop());
        }
    }
    });



    function unite(leftEyebrow, rightEyebrow) {
        const united = [];
        for (const point of leftEyebrow) { united.push(point); }
        for (const point of rightEyebrow) {united.push(point); }
        return united;
        }
        
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
        const box = { bottom: -Infinity, left: Infinity, right: -Infinity, top: Infinity,
          get center() {return { x: this.left + this.width / 2, y: this.top + this.height / 2, };
        },
        get height() { return this.bottom - this.top; },
        get width() {  return this.right - this.left; },
        };
        for (const point of points) {
            box.left = Math.min(box.left, point.x);
            box.right = Math.max(box.right, point.x);
            box.bottom = Math.max(box.bottom, point.y);
            box.top = Math.min(box.top, point.y);
        }
        return box;
    }


function calcularPontoDeOlhar(face) {
  const olhoEsquerdo = face.landmarks.positions.slice(36, 42);
  const olhoDireito = face.landmarks.positions.slice(42, 48);

  // Calculando os pontos centrais para cada olho
  const centroEsquerdo = calcularCentro(olhoEsquerdo);
  const centroDireito = calcularCentro(olhoDireito);

  // Calculando um ponto médio entre os centros dos dois olhos
  const pontoFocal = {
      x: (centroEsquerdo.x + centroDireito.x) / 2,
      y: (centroEsquerdo.y + centroDireito.y) / 2
  };

  return pontoFocal;
}

function calcularCentro(pontos) {
  const totalPontos = pontos.length;
  const centro = pontos.reduce((soma, ponto) => {
      soma.x += ponto._x;
      soma.y += ponto._y;
      return soma;
  }, {x: 0, y: 0});

  centro.x /= totalPontos;
  centro.y /= totalPontos;
  return centro;
}
function verificarBotaoSobOlhar(pontoFocal) {
  const botoes = document.querySelectorAll('.eye-button'); 
  for(const botao of botoes) {
      const rect = botao.getBoundingClientRect();
      if (
          pontoFocal.x >= rect.left && pontoFocal.x <= rect.right &&
          pontoFocal.y >= rect.top && pontoFocal.y <= rect.bottom
          
      ) {
        console.log(pontoFocal)
          return botao; // Retornará o botão que está sob o olhar
      }
  }
  return null; // Retornará null se nenhum botão estiver sob o olhar
}

function createOverlayElement() {
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.border = "2px solid #FF0000";
    overlay.style.width = "30px"; 
    overlay.style.height = "20px"; 
    document.body.appendChild(overlay);
    return overlay;
}

function updateOverlayPosition(overlay, x, y) {
    overlay.style.left = x - 25 + "px"; // centralizando o overlay no eixo X
    overlay.style.top = y - 20 + "px";  // centralizando o overlay no eixo Y
}
function removeOverlayElement(overlay) {
    document.body.removeChild(overlay);
}

const eyeOverlay = createOverlayElement();  
    document.querySelectorAll('.eye-button').forEach(botao => {
        botao.addEventListener('mouseenter', () => {
            tempoInicial = new Date().getTime();
        });
        botao.addEventListener('mouseleave', () => {
            tempoInicial = null;
        });
    });

    setInterval(() => {
        if(tempoInicial && new Date().getTime() - tempoInicial > tempoDeSelecao) {
            console.log('Botão selecionado!');
            tempoInicial = null;
            // Adicione a lógica para lidar com a seleção do botão aqui
           
        }
    }, 100); 
    
    for (const face of resizedDetections) {
      //const pontoFocal = calcularPontoDeOlhar(face);
      
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
        pontos.appendChild(pre);
        
        for (const eye of [features.olhoEsquerdo, features.olhoDireito]) {
            const eyeBox = getBoxFromPoints(eye);
            const fontSize = 20;
            const context = canvas.getContext("2d");
            context.lineWidth = 2;
            context.fillStyle = "#FF0000";
            context.beginPath();
            context.fillStyle = "rgba(20,30,22,0.5)";
            context.strokeRect(eyeBox.center.x-10, eyeBox.center.y-10, 30, 20, 30 );
            context.arc(eyeBox.center.x, eyeBox.center.y, 4, 0, 2 * Math.PI);
            context.fillStyle = "rgba(255, 255, 255, 0)";
            context.fill();
            context.closePath();
            let rect = canvas.getBoundingClientRect();
            let pontoFocal = {
                x: eyeBox.center.x + rect.left,
                y: eyeBox.center.y + rect.top
            };
            const botaoSobOlhar = verificarBotaoSobOlhar(pontoFocal);
            
            updateOverlayPosition(eyeOverlay, eyeBox.center.x, eyeBox.center.y);
            
            console.log(botaoSobOlhar)
            console.log(botaoSelecionado)
          if (botaoSobOlhar) {
            
            if (botaoSelecionado !== botaoSobOlhar) {
                removeOverlayElement(eyeOverlay);
                botaoSelecionado = botaoSobOlhar;
                tempoInicial = new Date().getTime();
            } else if (new Date().getTime() - tempoInicial > tempoDeSelecao) {
                console.log('Botão selecionado:', botaoSelecionado.id);
                alert(botaoSelecionado.id)
            }
        } else {
            botaoSelecionado = null;
            tempoInicial = null;
        }
        }
    }
}, 500)
} else {
    clearInterval(extractPointsInterval);
}
});
