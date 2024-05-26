// Parse json data from web.
async function fetchAndParseRSSFeed() {
    try {
        // Fetch data from 'proxy server'.
        const response = await fetch('https://lolo-v5-server.onrender.com');
        return response.json();
    } catch (error) {
        console.error('Error fetching or parsing RSS feed:', error);
        return [];
    }
}

$(document).ready(async function () {
    const feed = await fetchAndParseRSSFeed();
    if (feed.length > 0) {
        console.log("received " + feed.length + " elements");
        renderFeed(feed);
    } else {
        console.log("No items received");
    }
});

// Renders feed. Build new instances if landed on the page for the first time.
function renderFeed(feed) {
    // true if page initial loading.
    if (restoreContainerState()) {
        let feedContent = '';
        $.each(feed, function (index, item) {
            // Format the date.
            let formatted = {day: "numeric", month: "long", year: "numeric"};
            let articleDate = new Date(item.item.pubDate).toLocaleDateString("en-GB", formatted);
            let newsLink = item.item.link;
            let author = item.item.author || null;
            let imageURL = item.item.media?.['$']?.url;
            let category = item.item.categories[0]['_'] || null;
            console.log(category + index);

            // News element.

            feedContent += `<div id="${ index }" class="newsElement">
                                <div class="clickable-div">
                                    <a class="clickable" href="${ newsLink }">
                                        <img class="newsElement-image" src="${ imageURL }" alt="display-image">
                                        <h2 class="title">${ item.item.title }</h2>
                                        <p class="content">${ item.item.content }</p>
                                    </a>
                                </div>`;
            if (category != null) feedContent += '<div class="'+ category +'"></div>';
            else feedContent += '<div></div>'

            if (author) feedContent += `<p class="author">by ${ author }</p>`;

            feedContent += `<p class="pubDate">${ articleDate }</p>
                            <div class="user-options">
                                <button style="background: none" id="like${ index }">
                                    <img src="./public/assets/heart.svg" class="like-button" alt="heart">
                                </button>
                                <button style="background: none" id="flag${ index }">
                                    <img class="flag-button" src="./public/assets/flag.svg" alt="flag">
                                </button>
                                <button style="background: none" id="close${ index }">
                                    <img class="remove-button" src="./public/assets/remove.svg" alt="remove">
                                </button>
                            </div>
                         </div>`;
        });
        // Append the generated content to feed container.
        $('#feed-container').append(feedContent);
        console.log("Welcome!");
    }
    attachEventHandlers();
    $('#later-container').hide();
    $('#liked-container').hide();
    $('#removed-container').hide();
}
function restoreContainerState() {
    // Returns true if page is loaded first time.
    let isFirstLoad = true;

    const state = JSON.parse(localStorage.getItem('containerState'));
    if (state) {
        ['feed', 'removed', 'liked', 'later'].forEach(containerId => {
            // Access all keys from the saved data.
            const savedHtml = state[containerId];
            if (savedHtml) {
                if (isFirstLoad) {
                    isFirstLoad = false;
                }
                // Set the innerHTML of the container to its saved state.
                $('#' + containerId + '-container').html(savedHtml);
            }
        });
    }
    return isFirstLoad;
}