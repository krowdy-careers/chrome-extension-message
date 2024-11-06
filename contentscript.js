const scrapProfile = async()=>{
    const sleep = (seconds)=>{
        return new Promise((resolve)=>{
            setTimeout(function(){resolve();},seconds*1000)
        })
    }

    const createPopup = ()=>{
        const styleDiv = "position: fixed;z-index: 2000;width:50%; top: 0px;left: 200px;overflow: visible;display: flex;align-items: flex-end;background-color: lightgray;font-size: 10px;padding: 10px;";
        const stylePre = "position: relative;max-height: 400px;overflow: scroll;width: 100%;"
        const div = document.createElement('div')
        div.id = "krowdy-message"
        div.style = styleDiv

        const pre = document.createElement('pre')
        pre.id = "krowdy-pre"
        pre.style = stylePre

        const button = document.createElement('button')
        
        button.id = "krowdy-button"
        button.style = "background: gray;border: 2px solid;padding: 8px;"
        button.innerText ="Aceptar"

        const bodyElement = document.querySelector('div.body')
        
        bodyElement.appendChild(div)

        pre.innerText = "Estamos extrayendo la información!!!!"
        div.appendChild(pre)
        div.appendChild(button)
        return {div,pre,button}
    }

    const autoscrollToElement = async function(cssSelector){

        var exists = document.querySelector(cssSelector);
    
        while(exists){
            //
            let maxScrollTop = document.body.clientHeight - window.innerHeight;
            let elementScrollTop = document.querySelector(cssSelector).offsetHeight
            let currentScrollTop = window.scrollY
    
    
            if(maxScrollTop <= currentScrollTop+ 20 || elementScrollTop <= currentScrollTop)
                break;
    
            await sleep(0.005)
    
            let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop);

            console.log(`${maxScrollTop}, ${currentScrollTop}, ${elementScrollTop}`);
            window.scrollTo(0,newScrollTop)
        }
    
        console.log('finish autoscroll to element %s', cssSelector);
    
        return new Promise(function(resolve){
            resolve();
        });
    };

    const selectorProfile = {
        name: '.text-heading-xlarge',
        pais: 'div.mt2>div.pb2>span.text-body-small',
        showContactInfo : 'div.pb5 > div.mt2 > div.pb2 > span.pv-text-details__separator > a',
        phone: 'section.ci-phone > ul > li > span'
    }
    let profile ={}
    const getContactInfo = async()=>{
        const {name,pais,showContactInfo,phone} = selectorProfile
        const nameElement = document.querySelector(name)
        const paisElement = document.querySelector(pais)
        
        profile.name = nameElement.innerText
        profile.pais = paisElement.innerText

        await autoscrollToElement('body')

        //Popup Contact Info
        const showContactInfoElement = document.querySelector(showContactInfo)
        showContactInfoElement.click()

        await sleep(5)

        const phoneElement = document.querySelector(phone)
        profile.phone = phoneElement?.innerText
    }

    const {div,pre,button} = createPopup()
    pre.innerText = 'Scaneando el perfil'

    await getContactInfo()


    pre.innerText = 'Ya tenemos las información del perfil'
    await sleep(1)

    pre.innerText = JSON.stringify(profile,null,2)
    console.log(profile)
}


(function(){
    console.log('ejecuto el contentscript')
    chrome.runtime.onConnect.addListener(function(port){
            port.onMessage.addListener(async (message)=>{
                console.log(message)
                const {action} = message;
                if(action == "scrapingProfile"){
                    await scrapProfile()
                }
            } )
    })
})()