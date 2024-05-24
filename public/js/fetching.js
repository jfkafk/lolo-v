import RSSParser from 'rss-parser';

const parser = ({ RSSParser,
    customFields: {
        // to fetch media:content along with image.
        item:[
            ['media:content', "media"]
        ]
    }
});
let articles = [];

export const parse = async url => {
    const feed = await parser.parseURL(url);


    feed.items.forEach(item => {
        articles.push({ item })
    })
    console.log(articles)
    return articles
};

parse('https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss');