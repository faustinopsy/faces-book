
let resultsContainer = document.querySelector("#detectar-emocoes-results");
let resultsidade = document.querySelector("#detectar-emocoes-idade");
let pontos = document.querySelector("#pontos");
let stream;
let startCameraButton = document.getElementById("start-camera-button");
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
let videox = document.getElementById("video");
let startCameraInterval;
    extractPointsButton.disabled = true;


    startCameraButton.addEventListener("change", async (event) => {
    if (event.target.checked) {
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
        extractPointsButton.removeEventListener("change", extractPointsButton);
 
        clearInterval(extractPointsInterval);
        resultsContainer.innerHTML = "";
        video.srcObject = null;
        if (stream != null) {
        stream.getTracks().forEach((track) => track.stop());
        }
    }
    });

    let resetTimer;
    let currentIndex = 0; 
     function piscar() {
        const btnOptions = document.querySelectorAll('.eye-button');
        btnOptions[currentIndex].classList.remove('selected'); 
        currentIndex = (currentIndex + 1) % btnOptions.length;  
        btnOptions[currentIndex].classList.add('selected');  
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
        if(btnOptions[currentIndex].innerText!="#"){
        document.getElementById("text").innerHTML += btnOptions[currentIndex].innerText;
        }else{
        document.getElementById("text").innerHTML ="";
        }
            btnOptions[currentIndex].classList.remove('selected');
            currentIndex = 0; 
            btnOptions[currentIndex].classList.add('selected'); 
        }, 3000); 
    }

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
    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;
    
    points.forEach(point => {
        minX = Math.min(minX, point.x);
        minY = Math.min(minY, point.y);
        maxX = Math.max(maxX, point.x);
        maxY = Math.max(maxY, point.y);
    });

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        center: {
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2
        }
    };
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
        
          return botao; 
      }
  }
  return null; 
}


    for (const face of resizedDetections) {
        const features = {
            olhoEsquerdo: face.landmarks.positions.slice(36, 42),
            olhoDireito: face.landmarks.positions.slice(42, 48),
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
            context.beginPath()
            let rect = canvas.getBoundingClientRect();
            let pontoFocal = {
                x: eyeBox.center.x + rect.left,
                y: eyeBox.center.y + rect.top
            };
            const botaoSobOlhar = verificarBotaoSobOlhar(pontoFocal);
            
          if (botaoSobOlhar) {
            piscar();
            context.fillStyle = "rgba(0, 255, 0, 0.5)"; // Verde
            context.strokeStyle = "#00FF00"; // Verde
            if (botaoSelecionado !== botaoSobOlhar) {
                //removeOverlayElement(eyeOverlay);
                botaoSelecionado = botaoSobOlhar;
                tempoInicial = new Date().getTime();
            // } else if (new Date().getTime() - tempoInicial > tempoDeSelecao) {
            //     console.log('Botão selecionado:', botaoSelecionado.id);
            //     alert(botaoSelecionado.id)
                
             }
        } 
        else {
             context.fillStyle = "rgba(20, 30, 22, 0.5)"; // Sua cor original
        context.strokeStyle = "#FF0000"; // Vermelho
    }
    
    context.strokeRect(eyeBox.center.x-10, eyeBox.center.y-10, 30, 20);
    context.fillRect(eyeBox.center.x-10, eyeBox.center.y-10, 30, 20);
    context.arc(eyeBox.center.x, eyeBox.center.y, 4, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
        
        }
    }
}, 500)
} else {
    clearInterval(extractPointsInterval);
}
});
