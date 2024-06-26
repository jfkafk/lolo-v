// Map where category images are loaded from.
let categoryImageMap = new Map();
categoryImageMap.set('Authentication', '/public/assets/auth.svg')
categoryImageMap.set('Productivity', '/public/assets/prod.svg')
categoryImageMap.set('Design', '/public/assets/design.svg')
categoryImageMap.set('Technology', '/public/assets/tech.svg')
categoryImageMap.set('ChatGPT', '/public/assets/ai.svg')
categoryImageMap.set('no-category', '/public/assets/no-category.svg')

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
            let category = item.item.categories[0]['_'] || 'no-category';
            let categoryImg = categoryImageMap.get(category);

            let isTech = category === 'Technology';
            let isAI = category === 'ChatGPT';

            // Two categories must be in feed and category container.
            if (isTech) {
                // Append the generated content to feed container.
                feedContent += handleCategoryContent(item, index);
            }
            else if (isAI) {
                // Append the generated content to feed container.
                feedContent += handleCategoryContent(item, index);
            }

            else {
                // News element.
                feedContent += `<div id="${ index }" class="newsElement">
                                <div class="clickable-div">
                                    <a class="clickable" href="${ newsLink }">
                                        <img class="newsElement-image" src="${ imageURL }" alt="display-image">
                                        <h2 class="title">${ item.item.title }</h2>
                                        <p class="content">${ item.item.content }</p>
                                    </a>
                                </div>`;

                if (author) feedContent += `<p class="author">by ${ author }</p>`;

                feedContent += `<p class="pubDate">${ articleDate }</p>
                            <div class=${ category }>
                                <img class="img-"${ category + '-img' } src=${ categoryImg } alt=${ category }>
                                <h3 class="${ category + '-text' }">${ category }</h3>
                            </div>
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
            }
        });
        // Append the generated content to feed the container.
        $('#feed-container').append(feedContent);
        console.log("Welcome!");
        $('.loading').hide();
    }
    $('.loading').hide();
    $('.pick-category').show();
    attachEventHandlers();

    // On default hide all containers except feed.
    $('#later-container').hide();
    $('#liked-container').hide();
    $('#removed-container').hide();
    $('#ai-container').hide();
    $('#tech-container').hide();
}

// Restores old state if there is one.
function restoreContainerState() {
    // Returns true if page is loaded first time.
    let isFirstLoad = true;

    const state = JSON.parse(localStorage.getItem('containerState'));
    if (state) {
        ['feed', 'removed', 'liked', 'later', 'ai', 'tech'].forEach(containerId => {
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

// If element has category, handle it here.
function handleCategoryContent(item, index) {
    let feedContent = '';
    // Format the date.
    let formatted = {day: "numeric", month: "long", year: "numeric"};
    let articleDate = new Date(item.item.pubDate).toLocaleDateString("en-GB", formatted);
    let newsLink = item.item.link;
    let author = item.item.author || null;
    let imageURL = item.item.media?.['$']?.url;
    let category = item.item.categories[0]['_'] || 'no-category';
    let categoryImg = categoryImageMap.get(category);

    feedContent += `<div id="${ index }" class="newsElement">
                        <div class="clickable-div">
                            <a class="clickable" href="${ newsLink }">
                                <img class="newsElement-image" src="${ imageURL }" alt="display-image">
                                <h2 class="title">${ item.item.title }</h2>
                                <p class="content">${ item.item.content }</p>
                            </a>
                        </div>`;

    if (author) feedContent += `<p class="author">by ${ author }</p>`;

    feedContent += `<p class="pubDate">${ articleDate }</p>
                        <div class=${ category }>
                            <img class="img-"${ category + '-img' } src=${ categoryImg } alt=${ category }>
                            <h3 class="${ category + '-text' }">${ category }</h3>
                        </div>
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

    // Append to correct feed and return the element.
    if (category === 'Technology') $('#tech-container').append(feedContent);
    if (category === 'ChatGPT') $('#ai-container').append(feedContent);
    return feedContent;
}
