import RSSParser from 'rss-parser';

let parser = new RSSParser({
    customFields: {
        // to fetch media:content along with image.
        item: [
            [ 'media:content', "media" ]
        ]
    }
});

export const parseRssFeedAndCreateList = async () => {
    try {
        // Parse the RSS feed URL
        // Proxy to get around cors policy.
        const CORS_PROXY = "";

        // Construct the final URL to fetch
        const finalUrl = CORS_PROXY + 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss';

        // Fetch the RSS feed through the proxy
        await parser.parseURL(finalUrl, function (err, feed) {
            console.log(feed);
            feed.items.forEach(function(entry) {
                console.log(entry.title + ':' + entry.link);
            });
        });
        const itemList = feed.items.map(item => ({
            title: item.title,
            link: item.link,
            description: item.description,
            pubDate: item.pubDate,
            author: item.author,
            media: item.media
        }));

        // Convert the list of items to JSON and return.
        return JSON.stringify(itemList);
    } catch (error) {
        console.error("Error parsing RSS feed:", error);
        return null;
    }
};

parseRssFeedAndCreateList()
    .then(feedJson => console.log(feedJson))
    .catch(error => console.error(error));
