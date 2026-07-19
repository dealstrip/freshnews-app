const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'contentEncoded']
    ]
  }
});

// Main RSS Feeds for Malayalam, English, and Hindi
const LANGUAGES = {
  malayalam: {
    name: 'Malayalam',
    code: 'ml',
    feeds: [
      { name: 'Marunadan Malayali', url: 'https://news.google.com/rss/search?q=site:marunadanmalayali.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Manorama', url: 'https://news.google.com/rss/search?q=site:manoramaonline.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Mathrubhumi', url: 'https://news.google.com/rss/search?q=site:mathrubhumi.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Kerala Kaumudi', url: 'https://news.google.com/rss/search?q=site:keralakaumudi.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Deepika', url: 'https://news.google.com/rss/search?q=site:deepika.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Samakalika Malayalam', url: 'https://news.google.com/rss/search?q=site:samakalikamalayalam.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'News18 Malayalam', url: 'https://malayalam.news18.com/commonfeeds/v1/mal/rss/latest.xml' },
      { name: 'Oneindia Malayalam', url: 'https://malayalam.oneindia.com/rss/feeds/oneindia-malayalam-fb.xml' }
    ]
  },
  english: {
    name: 'English',
    code: 'en',
    feeds: [
      { name: 'Indian Express', url: 'https://indianexpress.com/feed/' },
      { name: 'The Hindu', url: 'https://www.thehindu.com/feeder/default.rss' },
      { name: 'Deccan Herald', url: 'https://www.deccanherald.com/feed/rss' }
    ]
  },
  hindi: {
    name: 'Hindi',
    code: 'hi',
    feeds: [
      { name: 'Amar Ujala', url: 'https://www.amarujala.com/rss/breaking-news.xml' },
      { name: 'Hindustan', url: 'https://api.livehindustan.com/feeds/rss/news-brief/rssfeed.xml' }
    ]
  },
  tamil: {
    name: 'Tamil',
    code: 'ta',
    feeds: [
      { name: 'Oneindia Tamil', url: 'https://tamil.oneindia.com/rss/feeds/oneindia-tamil-fb.xml' },
      { name: 'Asianet Tamil', url: 'https://tamil.asianetnews.com/rss' }
    ]
  },
  kannada: {
    name: 'Kannada',
    code: 'kn',
    feeds: [
      { name: 'Asianet Kannada', url: 'https://kannada.asianetnews.com/rss' }
    ]
  },
  telugu: {
    name: 'Telugu',
    code: 'te',
    feeds: [
      { name: 'Oneindia Telugu', url: 'https://telugu.oneindia.com/rss/feeds/telugu-news-fb.xml' }
    ]
  },
  bengali: {
    name: 'Bengali',
    code: 'bn',
    feeds: [
      { name: 'ABP Ananda Bengali', url: 'https://bengali.abplive.com/home/feed' }
    ]
  },
  marathi: {
    name: 'Marathi',
    code: 'mr',
    feeds: [
      { name: 'ABP Majha', url: 'https://marathi.abplive.com/home/feed' }
    ]
  },
  gujarati: {
    name: 'Gujarati',
    code: 'gu',
    feeds: [
      { name: 'Oneindia Gujarati', url: 'https://gujarati.oneindia.com/rss/feeds/gujarati-news-fb.xml' }
    ]
  },
  punjabi: {
    name: 'Punjabi',
    code: 'pa',
    feeds: [
      { name: 'ABP Sanjha', url: 'https://punjabi.abplive.com/home/feed' }
    ]
  }
};

// Strict rule-based text cleaner
function cleanText(text) {
  if (!text) return '';
  
  // Remove HTML tags if any
  let cleaned = text.replace(/<\/?[^>]+(>|$)/g, "");

  // RULE: NEVER use 'former' or 'current' before titles or roles
  // Example: "former president", "the former prime minister", "current senator"
  cleaned = cleaned.replace(/\b(former|current)\s+/gi, '');

  // RULE: STRICT NUMBER FORMATTING (No commas in numbers)
  // E.g., 300,000 -> 300000; 1,19,000 -> 119000
  // Running twice to clear nested commas in Indian numbering system
  cleaned = cleaned.replace(/(\d+),(\d+)/g, '$1$2');
  cleaned = cleaned.replace(/(\d+),(\d+)/g, '$1$2');

  return cleaned.trim();
}

// Function to call Mistral API for summarization if API key exists
async function summarizeWithMistral(title, content, languageCode) {
  // AI summarization disabled by user to use original news excerpts instead
  return null;

  const prompt = `You are a professional brief news writer.
Summarize the following news article title and description into a single, fully completed paragraph of about 50-60 words in ${languageCode === 'ml' ? 'Malayalam' : languageCode === 'hi' ? 'Hindi' : languageCode === 'ta' ? 'Tamil' : languageCode === 'kn' ? 'Kannada' : languageCode === 'te' ? 'Telugu' : languageCode === 'bn' ? 'Bengali' : languageCode === 'mr' ? 'Marathi' : languageCode === 'gu' ? 'Gujarati' : languageCode === 'pa' ? 'Punjabi' : 'English'}.

CRITICAL RULES:
1. Ensure the story is fully completed. Do not end with incomplete sentences, and do not use ellipses (...). If a sentence cannot be completed, skip it.
2. NEVER use the words 'former' or 'current' before any title or role (e.g., do NOT write 'former president', 'former prime minister', 'current senator'). Use only their name or exact title.
3. NEVER use commas inside numbers (e.g. write 300000, not 300,000; write 4500, not 4,500).
4. Output ONLY the translated/summarized paragraph. Do not include introductory text, tags, or concluding promotional phrases.

Title: ${title}
Content: ${content}`;

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    }
  } catch (error) {
    console.error('Mistral API error, falling back to local processing:', error.message);
  }
  return null;
}

// Helper to extract image URLs from RSS item
function getImageUrl(item) {
  if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
    return item.mediaContent.$.url;
  }
  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }
  // Search contentEncoded or content for img tags
  const content = item.contentEncoded || item.content || '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1];
  }
  return '';
}

async function run() {
  const feedsDir = path.join(__dirname, 'www', 'feeds');
  if (!fs.existsSync(feedsDir)) {
    fs.mkdirSync(feedsDir, { recursive: true });
  }

  for (const [langKey, langInfo] of Object.entries(LANGUAGES)) {
    console.log(`Processing language: ${langInfo.name}...`);
    const articles = [];
    const seenTitles = new Set();

    for (const source of langInfo.feeds) {
      try {
        console.log(`Fetching ${source.name} RSS feed...`);
        const feed = await parser.parseURL(source.url);
        
        for (const item of feed.items) {
          let title = cleanText(item.title);
          let rawDesc = item.contentSnippet || item.content || '';
          let cleanedDesc = cleanText(rawDesc);

          // Skip completely empty items
          if (!title || !cleanedDesc) continue;

          // Deduplication: avoid same article multiple times
          const normTitle = title.toLowerCase().replace(/[^a-z0-9]/gi, '');
          if (seenTitles.has(normTitle)) continue;
          seenTitles.add(normTitle);

          // Completeness check moved to after fallback generation
          let summary = '';
          // Try to summarize with Mistral, if it fails or key is missing, fall back to cleaned RSS description
          const aiSummary = await summarizeWithMistral(title, rawDesc, langInfo.code);
          if (aiSummary) {
            summary = cleanText(aiSummary);
          } else {
            summary = cleanedDesc;
          }

          // Keep the full snippet from RSS, just strip "read more" strings at the very end
          summary = summary.replace(/\b(read more|continue reading)[.\s]*$/i, '').trim();

          const finalSummary = summary;

          // Format relative time or clean date
          const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

          articles.push({
            id: item.guid || item.link || Math.random().toString(36).substring(2, 9),
            title: title,
            summary: finalSummary,
            link: item.link,
            pubDate: pubDate,
            source: source.name,
            image: getImageUrl(item)
          });
        }
      } catch (err) {
        console.error(`Error reading ${source.name} (${source.url}):`, err.message);
      }
    }

    // Sort: Newest articles first
    articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    // Limit to top 100 stories for maximum variety across all sources
    const finalArticles = articles.slice(0, 100);

    // Save JSON database file
    const fileTarget = path.join(feedsDir, `${langKey}.json`);
    fs.writeFileSync(fileTarget, JSON.stringify(finalArticles, null, 2));
    console.log(`Saved ${finalArticles.length} stories to ${fileTarget}\n`);
  }

  console.log('Feed generation complete!');
}

run();
