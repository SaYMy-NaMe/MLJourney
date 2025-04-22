chrome.runtime.onInstalled.addListener(()=>{
    chrome.storage.sync.get(["geminiapiKey"], (result)=> {
        if(!result.geminiApiKey){
            chrome.tabs.create({url: "options.html"}); 
        }
    }); 
}); 