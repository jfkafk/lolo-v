// Parse json data from web.
async function fetchAndParseRSSFeed() {
    try {
        const response = await fetch('https://lolo-v5-server.onrender.com');
        return response.json(); // Return the items array
    } catch (error) {
        console.error('Error fetching or parsing RSS feed:', error);
        return [];
    }
}
// Create html elements from received json.
$(document).ready(async function () {
    const feed = await fetchAndParseRSSFeed();
    let feedContent = '';
    console.log("received " + feed.length + "items")
    $.each(feed, function (index, item) {

        // Format the date.
        let formatted = {day: "numeric", month: "long", year: "numeric"};
        let articleDate = new Date(item.item.pubDate).toLocaleDateString("en-GB", formatted);
        let newsLink = item.item.link;

        let author = item.item.author || null;

        let imageURL = item.item.media?.['$']?.url;

        // News element.
        feedContent += '<div id="' + index + '" class="newsElement">';
        feedContent += '<div class="clickable-div">';
        feedContent += '<a class="clickable" href=' + newsLink + '>';
        feedContent += '<img class="newsElement-image" src="' + imageURL + '" alt="display-image">';
        feedContent += '<h2 class="title">' + item.item.title + '</h2>';
        feedContent += '<p class="content">' + item.item.content + '</p>';
        feedContent += '</div>';
        feedContent += '</a>';
        if (author != null) feedContent += '<p class="author">' + "by " + item.item.author + '</p>';
        feedContent += '<p class="pubDate">' + articleDate + '</p>';
        // Buttons bottom side.
        feedContent += '<div class="user-options">';
        feedContent += '<button style="background: none" id="like' + index + '">' +
            '<img class="like-button" src="./public/assets/heart.svg" alt="heart"' +
            '</button>'; // liked.

        feedContent += '<button style="background: none"  id="flag' + index + '">' +
            '<img class="flag-button" src="./public/assets/flag.svg" alt="flag"' +
            '</button>'; // flagged.

        feedContent += '<button style="background: none"  id="close' + index + '">' +
            '<img class="remove-button" src="./public/assets/remove.svg" alt="remove">' +
            '</button>'; // removed.
        feedContent += '</div>';
        feedContent += '</div>';
        feedContent += '</div>';
    });
    // Append the generated content to feed container.
    $('#feed-container').append(feedContent);
});