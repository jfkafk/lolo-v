import fetch from "node-fetch";

async function getTextContent(url) {
    try {
        const response = await fetch('https://uptime-mercury-api.azurewebsites.net/webparser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            return null;
        }
        const textContent = await response.text();
        let jsonObject = JSON.parse(textContent);
        console.log(jsonObject.content);
        return jsonObject.content || null;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
