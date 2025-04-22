document.getElementById("summarize").addEventListener("click", () => {    
    const resultDiv = document.getElementById("result"); 
    const summaryType = document.getElementById("summary-type").value; 
    
    resultDiv.innerHTML = '<div class="loader"></div>'; 

    // 1. Get the user's API Key
    chrome.storage.sync.get(['geminiapiKey'], ({geminiapiKey}) => {
        if (!geminiapiKey) {
            resultDiv.textContent = "No API Key is set. Click the gear icon to add one.";
            return;
        }
        // 2. Ask content.js for the page text (move this inside)
        chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, {type: "GET_ARTICLE_TEXT"}, async ({text}) => {
                if (!text) {
                    resultDiv.textContent = "Couldn't extract text from this page"; 
                    return; 
                }
                // 3. Send text to Gemini
                try {
                    const summary = await getGeminiSummary(text, summaryType, geminiapiKey); 
                    resultDiv.textContent = summary; 
                } catch (error) {
                    resultDiv.textContent = "Gemini Error: " + error.message; 
                }
            }); 
        });
    });
});


async function getGeminiSummary(rawText, type, apiKey){
    const max = 20000; 
    const text = rawText.length > max ? rawText.slice(0, max) + "...": rawText; 
    let prompt;
    switch (type) {
        case "brief":
        prompt = `Provide a brief summary of the following article in 2-3 sentences:\n\n${text}`;
        break;
        case "detailed":
        prompt = `Provide a detailed summary of the following article, covering all main points and key details:\n\n${text}`;
        break;
        case "bullets":
        prompt = `Summarize the following article in 5-7 key points. Format each point as a line starting with "- " (dash followed by a space). Do not use asterisks or other bullet symbols, only use the dash. Keep each point concise and focused on a single key insight from the article:\n\n${text}`;
        break;
        default:
        prompt = `Summarize the following article:\n\n${text}`;
    }
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify({
            contents: [{parts: [{text: prompt}]}], 
            generationConfig: {temperature: 0.2}, //How creative you want the model should be (Optional)
        })
    })

    if(!res.ok){
        const {error} = await res.json(); 
        throw new Error(error?.message || "Request failed"); 
    }
    const data = await res.json(); 
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No Summary"; 
}
