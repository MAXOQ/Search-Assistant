const search = document.getElementById("search");
const apikey = document.getElementById("apikey");
const showbtn = document.getElementById("showbtn");
const configToggle = document.getElementById("configToggle");
const configMenu = document.getElementById("configMenu");

const STORAGE_KEY = "openai_api_key";

apikey.value = localStorage.getItem(STORAGE_KEY) || "";

document.getElementById("searchBtn").addEventListener("click", async () => {
    await activate_search();
});

search.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        activate_search();
    }
}); 

async function activate_search() {
    let url = await getAIResponse(search.value);

    url = url.trim();

    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }

    browser.tabs.create({
        url: url
    });
}

showbtn.addEventListener("click", showKey); 

apikey.addEventListener("input", () => {
    localStorage.setItem(STORAGE_KEY, apikey.value);
});

async function getAIResponse(AISearch) {
    const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apikey.value}`
        },
        body: JSON.stringify({
            model: "gpt-4.1-mini",
            //model: "gpt-4o-mini-search-preview",
            //tools: [{ "type": "web_search" }],
            temperature: 0,
            input: `Search the internet and return only a url that corresponds with this search, do not include any other text \"${AISearch}\"`
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const data = await response.json();
    return data.output[0].content[0].text;
}

function showKey() {
    if (apikey.type === "password") {
        apikey.type = "text";
        showbtn.textContent = "Hide";
    } else {
        apikey.type = "password";
        showbtn.textContent = "Show";
    }
}

configToggle.addEventListener("click", () => {
    configMenu.style.display =
        configMenu.style.display === "none" ? "block" : "none";
});