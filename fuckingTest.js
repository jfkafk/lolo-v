import RSSParser from 'https://npmjs.org/package/rss-parser';

let parser = new RSSParser({
    customFields: {
        // to fetch media:content along with image.
        item:[
            ['media:content', "media"]
        ]
    }
});

export const parseRssFeedAndCreateList = async () => {
    try {
        // Parse the RSS feed URL
        const feed = await parser.parseURL('https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss');

        // Extract and convert each item to JSON.
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
