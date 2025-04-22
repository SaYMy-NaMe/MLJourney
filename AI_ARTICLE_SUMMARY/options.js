document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(['geminiapiKey'], (data) => {
        if(data.geminiapiKey) document.getElementById('api-key').value = data.geminiapiKey; 
    });    
    document.getElementById("save-button").addEventListener("click", () => {
        const apiKey = document.getElementById("api-key").value.trim(); 
        if(!apiKey) return; 
        chrome.storage.sync.set({geminiapiKey: apiKey}, () => {
            document.getElementById("success-message").style.display = "block"; 
            setTimeout(() => window.close(), 1000); 
        })
    })
})