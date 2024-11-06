const scrapeaElement = document.getElementById('scrapea')
const textoRespuestaElement = document.getElementById('textoRespuesta')
scrapeaElement.addEventListener('click', ()=>{
    chrome.runtime.sendMessage({action:"scrapea"},(response)=>{
        const {message} = response
        textoRespuestaElement.innerText = message
    })
})