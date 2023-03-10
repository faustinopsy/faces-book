var foto1 = [];
var foto2 = [];
async function imagem1() {
    const verificado = document.getElementById("verificado")
    const img1 = document.getElementById('img1');
	verificado.innerText = "espere..."
	let preview = document.getElementById('imagem1');
	var inputs = document.querySelectorAll('input[type=file]');
    let file = inputs[0].files[0];
	const reader = new FileReader();
    if(file) reader.readAsDataURL(file);
	else preview.src = '';
	reader.onloadend = function() {
		preview.src = reader.result;
	}
     try {
        const img = await faceapi.bufferToImage(file)
         result = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().withFaceExpressions().withAgeAndGender()
		 const regionsToExtract = 
        [
        new faceapi.Rect(result.detection._box._x,result.detection._box._y,
        result.detection._box._width,result.detection._box._height)
        ]
		const canvases = await faceapi.extractFaces(img, regionsToExtract)
		displayExtractedFaces(canvases) 
        verificado.innerText = "Escolha a 2ª "
		img1.innerText = 'Idade '+result.age.toFixed(2)+'\n'+' Genero '+result.gender+' - '+result.genderProbability.toFixed(2) * 100 +'%\n'+
		'Neutro: '+result.expressions.Neutro.toFixed(2)* 100 +'%\n'+
        'Feliz: '+result.expressions.Feliz.toFixed(2)* 100 +'%\n'+
        'Triste: '+result.expressions.Triste.toFixed(2)* 100 +'%\n'+
        'Medo: '+ result.expressions.Medo.toFixed(2)* 100 +'%\n'+
        'Nojo: '+result.expressions.Nojo.toFixed(2)* 100 +'%\n'+
        'Surpreso: '+ result.expressions.Surpreso.toFixed(2)* 100 +'%\n'+
        'Raiva: '+result.expressions.Raiva.toFixed(2)* 100 +'%';
        foto1.push(result.descriptor)
     } catch (err) {
        alert("Não foi possivel detectar o rosto")
         return;
     }
}
  function displayExtractedFaces(faceImages) {
	   var canvas = document.createElement("canvas");
       canvas = $('#overlay').get(0)    
       faceapi.matchDimensions(canvas, $('#imagem1').get(0))
       $('#facesContainer').empty()
       faceImages.forEach(canvas => $('#facesContainer').append(canvas))
	   document.getElementsByTagName("canvas")[2].setAttribute("id", 'cv3');
	   var c3 = document.getElementById("cv3");
	   var data3 = c3.toDataURL();
	   let preview2 = document.getElementById('imagem1');
	   preview2.src =data3;
	   c3.setAttribute("hidden", "hidden");
		 
    }
    function displayExtractedFaces2(faceImages) {
        var canvas = document.createElement("canvas");
        canvas = $('#overlay').get(0)   
        faceapi.matchDimensions(canvas, $('#imagem2').get(0))
        $('#facesContainer').empty()
        faceImages.forEach(canvas => $('#facesContainer').append(canvas))
        document.getElementsByTagName("canvas")[2].setAttribute("id", 'cv3');
        var c3 = document.getElementById("cv3");
        var data3 = c3.toDataURL();
        let preview2 = document.getElementById('imagem2');
        preview2.src =data3;
        c3.setAttribute("hidden", "hidden");   
     }
async function imagem2() {
    const verificado = document.getElementById("verificado")
    const img2 = document.getElementById('img22');
	verificado.innerText = "espere..."
	let preview = document.getElementById('imagem2');
	var inputs = document.querySelectorAll('input[type=file]');
    let file = inputs[1].files[0];
	const reader = new FileReader();
    if(file) reader.readAsDataURL(file);
	else preview.src = '';
	reader.onloadend = function() {
		preview.src = reader.result;
	}
     try {
        const img = await faceapi.bufferToImage(file)
        result = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor().withFaceExpressions().withAgeAndGender() 
        const regionsToExtract = 
				[
				new faceapi.Rect(result.detection._box._x,result.detection._box._y,
				result.detection._box._width,result.detection._box._height)
				]
		const canvases = await faceapi.extractFaces(img, regionsToExtract)
		displayExtractedFaces2(canvases) 
        img2.innerText = 'Idade '+result.age.toFixed(2)+'\n'+' Genero '+result.gender+' - '+result.genderProbability.toFixed(2) * 100 +'%\n'+
		'Neutro: '+result.expressions.Neutro.toFixed(2)* 100 +'%\n'+
        'Feliz: '+result.expressions.Feliz.toFixed(2)* 100 +'%\n'+
        'Triste: '+result.expressions.Triste.toFixed(2)* 100 +'%\n'+
        'Medo: '+ result.expressions.Medo.toFixed(2)* 100 +'%\n'+
        'Nojo: '+result.expressions.Nojo.toFixed(2)* 100 +'%\n'+
        'Surpreso: '+ result.expressions.Surpreso.toFixed(2)* 100 +'%\n'+
        'Raiva: '+result.expressions.Raiva.toFixed(2)* 100 +'%';
        foto2.push(result.descriptor)
        verificado.innerText = "verificando...";	
        verificar();
     } catch (err) {
        alert("Não foi possivel detectar o rosto")
        return;
     }
}
async function verificar() {
    const verificado = document.getElementById("verificado")
    verificado.setAttribute("disabled", "true");
	verificado.innerText = "verificando..."
    var labeledFaceDescriptors = []
    labeledFaceDescriptors.push(new faceapi.LabeledFaceDescriptors(
    'person 1', foto1 ));
    try {
        var inputs = document.querySelectorAll('input[type=file]');
        let file = inputs[1].files[0];
        const img = await faceapi.bufferToImage(file)
        const singleResult = await faceapi.detectSingleFace(img)
        .withFaceLandmarks().withFaceDescriptor()
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)
        const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
        if(bestMatch._distance<=0.50){
        verificado.setAttribute("class", "greenclass")
        verificado.innerText = "A mesma pessoa \n distância euclidiana entre os pontos: \n"+
        (1 - bestMatch._distance.toFixed(2)) * 100 +'%'
        verificado.removeAttribute("disabled")
        }else{
        verificado.setAttribute("class", "democlass")
        verificado.innerText = "Não é a mesma pessoa \n distância euclidiana entre os pontos: \n"+
        (1 - bestMatch._distance.toFixed(2)) * 100 +'%'
        verificado.removeAttribute("disabled")
    }   
    } catch (err) {
        verificado.innerText = "Erro ao tentar detectar"
        verificado.removeAttribute("disabled")
        return;
    }
}