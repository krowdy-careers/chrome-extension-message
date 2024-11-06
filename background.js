let tabSelected = null

chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
    const {action} = request;
    if(action=='scrapea'){
        
        chrome.tabs.query({active:true, currentWindow:true}).then((tabs)=>{
            const [tab] = tabs
            tabSelected = tab.id
            chrome.tabs.update(tab.id,{url:'https://www.linkedin.com/in/sharon-mendoza-51b697159/'}).then(()=>{
                sendResponse({message:'A la orden'})
            })
        })
    }

    return true;
})

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if(tabId == tabSelected){
        if(changeInfo.status == 'complete'){
            scrapingProfile()
            tabSelected = null
        }
    }
    return true
})

async function scrapingProfile(){
    const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    const port = chrome.tabs.connect(tab.id)
    port.postMessage({action: 'scrapingProfile'})
}
