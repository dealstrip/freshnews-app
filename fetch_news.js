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
      { name: 'Manorama Online', url: 'https://news.google.com/rss/search?q=site:manoramaonline.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Mathrubhumi', url: 'https://news.google.com/rss/search?q=site:mathrubhumi.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Asianet News', url: 'https://news.google.com/rss/search?q=site:asianetnews.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Madhyamam', url: 'https://news.google.com/rss/search?q=site:madhyamam.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Deshabhimani', url: 'https://news.google.com/rss/search?q=site:deshabhimani.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Kairali News', url: 'https://news.google.com/rss/search?q=site:kairalinewsonline.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: '24 News', url: 'https://news.google.com/rss/search?q=site:twentyfournews.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Reporter Live', url: 'https://news.google.com/rss/search?q=site:reporterlive.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Mangalam', url: 'https://news.google.com/rss/search?q=site:mangalam.com&hl=ml&gl=IN&ceid=IN:ml' },
      { name: 'Janmabhumi', url: 'https://news.google.com/rss/search?q=site:janmabhumi.in&hl=ml&gl=IN&ceid=IN:ml' }
    ]
  },
  english: {
    name: 'English',
    code: 'en',
    feeds: [
      { name: 'Times of India', url: 'https://news.google.com/rss/search?q=site:timesofindia.indiatimes.com&hl=en&gl=IN&ceid=IN:en' },
      { name: 'The Hindu', url: 'https://news.google.com/rss/search?q=site:thehindu.com&hl=en&gl=IN&ceid=IN:en' },
      { name: 'Hindustan Times', url: 'https://news.google.com/rss/search?q=site:hindustantimes.com&hl=en&gl=IN&ceid=IN:en' },
      { name: 'Indian Express', url: 'https://news.google.com/rss/search?q=site:indianexpress.com&hl=en&gl=IN&ceid=IN:en' },
      { name: 'The Wire', url: 'https://news.google.com/rss/search?q=site:thewire.in&hl=en&gl=IN&ceid=IN:en' },
      { name: 'Scroll.in', url: 'https://news.google.com/rss/search?q=site:scroll.in&hl=en&gl=IN&ceid=IN:en' },
      { name: 'NDTV', url: 'https://news.google.com/rss/search?q=site:ndtv.com&hl=en&gl=IN&ceid=IN:en' },
      { name: 'News18', url: 'https://news.google.com/rss/search?q=site:news18.com&hl=en&gl=IN&ceid=IN:en' },
      { name: 'Firstpost', url: 'https://news.google.com/rss/search?q=site:firstpost.com&hl=en&gl=IN&ceid=IN:en' },
      { name: 'Deccan Herald', url: 'https://news.google.com/rss/search?q=site:deccanherald.com&hl=en&gl=IN&ceid=IN:en' },
      { name: 'Telegraph India', url: 'https://news.google.com/rss/search?q=site:telegraphindia.com&hl=en&gl=IN&ceid=IN:en' },
      { name: 'Livemint', url: 'https://news.google.com/rss/search?q=site:livemint.com&hl=en&gl=IN&ceid=IN:en' }
    ]
  },
  hindi: {
    name: 'Hindi',
    code: 'hi',
    feeds: [
      { name: 'Dainik Jagran', url: 'https://news.google.com/rss/search?q=site:jagran.com&hl=hi&gl=IN&ceid=IN:hi' },
      { name: 'Dainik Bhaskar', url: 'https://news.google.com/rss/search?q=site:bhaskar.com&hl=hi&gl=IN&ceid=IN:hi' },
      { name: 'Amar Ujala', url: 'https://news.google.com/rss/search?q=site:amarujala.com&hl=hi&gl=IN&ceid=IN:hi' },
      { name: 'Navbharat Times', url: 'https://news.google.com/rss/search?q=site:navbharattimes.indiatimes.com&hl=hi&gl=IN&ceid=IN:hi' },
      { name: 'Live Hindustan', url: 'https://news.google.com/rss/search?q=site:livehindustan.com&hl=hi&gl=IN&ceid=IN:hi' },
      { name: 'Patrika', url: 'https://news.google.com/rss/search?q=site:patrika.com&hl=hi&gl=IN&ceid=IN:hi' },
      { name: 'Aaj Tak', url: 'https://news.google.com/rss/search?q=site:aajtak.in&hl=hi&gl=IN&ceid=IN:hi' },
      { name: 'Zee News Hindi', url: 'https://news.google.com/rss/search?q=site:zeenews.india.com/hindi&hl=hi&gl=IN&ceid=IN:hi' },
      { name: 'News18 Hindi', url: 'https://news.google.com/rss/search?q=site:hindi.news18.com&hl=hi&gl=IN&ceid=IN:hi' },
      { name: 'BBC Hindi', url: 'https://news.google.com/rss/search?q=site:bbc.com/hindi&hl=hi&gl=IN&ceid=IN:hi' }
    ]
  },
  tamil: {
    name: 'Tamil',
    code: 'ta',
    feeds: [
      { name: 'Daily Thanthi', url: 'https://news.google.com/rss/search?q=site:dailythanthi.com&hl=ta&gl=IN&ceid=IN:ta' },
      { name: 'Dinamalar', url: 'https://news.google.com/rss/search?q=site:dinamalar.com&hl=ta&gl=IN&ceid=IN:ta' },
      { name: 'Dinakaran', url: 'https://news.google.com/rss/search?q=site:dinakaran.com&hl=ta&gl=IN&ceid=IN:ta' },
      { name: 'Hindu Tamil', url: 'https://news.google.com/rss/search?q=site:hindutamil.in&hl=ta&gl=IN&ceid=IN:ta' },
      { name: 'Puthiya Thalaimurai', url: 'https://news.google.com/rss/search?q=site:puthiyathalaimurai.com&hl=ta&gl=IN&ceid=IN:ta' },
      { name: 'Polimer News', url: 'https://news.google.com/rss/search?q=site:polimernews.com&hl=ta&gl=IN&ceid=IN:ta' },
      { name: 'News18 Tamil', url: 'https://news.google.com/rss/search?q=site:tamil.news18.com&hl=ta&gl=IN&ceid=IN:ta' },
      { name: 'Samayam Tamil', url: 'https://news.google.com/rss/search?q=site:tamil.samayam.com&hl=ta&gl=IN&ceid=IN:ta' },
      { name: 'Vikatan', url: 'https://news.google.com/rss/search?q=site:vikatan.com&hl=ta&gl=IN&ceid=IN:ta' },
      { name: 'BBC Tamil', url: 'https://news.google.com/rss/search?q=site:bbc.com/tamil&hl=ta&gl=IN&ceid=IN:ta' }
    ]
  },
  kannada: {
    name: 'Kannada',
    code: 'kn',
    feeds: [
      { name: 'Vijay Karnataka', url: 'https://news.google.com/rss/search?q=site:vijaykarnataka.com&hl=kn&gl=IN&ceid=IN:kn' },
      { name: 'Kannada Prabha', url: 'https://news.google.com/rss/search?q=site:kannadaprabha.com&hl=kn&gl=IN&ceid=IN:kn' },
      { name: 'Udayavani', url: 'https://news.google.com/rss/search?q=site:udayavani.com&hl=kn&gl=IN&ceid=IN:kn' },
      { name: 'Prajavani', url: 'https://news.google.com/rss/search?q=site:prajavani.net&hl=kn&gl=IN&ceid=IN:kn' },
      { name: 'Public TV', url: 'https://news.google.com/rss/search?q=site:publictv.in&hl=kn&gl=IN&ceid=IN:kn' },
      { name: 'Asianet Suvarna', url: 'https://news.google.com/rss/search?q=site:kannada.asianetnews.com&hl=kn&gl=IN&ceid=IN:kn' },
      { name: 'News18 Kannada', url: 'https://news.google.com/rss/search?q=site:kannada.news18.com&hl=kn&gl=IN&ceid=IN:kn' },
      { name: 'TV9 Kannada', url: 'https://news.google.com/rss/search?q=site:tv9kannada.com&hl=kn&gl=IN&ceid=IN:kn' },
      { name: 'Vistara News', url: 'https://news.google.com/rss/search?q=site:vistaranews.com&hl=kn&gl=IN&ceid=IN:kn' },
      { name: 'Vishwawani', url: 'https://news.google.com/rss/search?q=site:vishwawani.news&hl=kn&gl=IN&ceid=IN:kn' }
    ]
  },
  telugu: {
    name: 'Telugu',
    code: 'te',
    feeds: [
      { name: 'Eenadu', url: 'https://news.google.com/rss/search?q=site:eenadu.net&hl=te&gl=IN&ceid=IN:te' },
      { name: 'Sakshi', url: 'https://news.google.com/rss/search?q=site:sakshi.com&hl=te&gl=IN&ceid=IN:te' },
      { name: 'Andhra Jyothy', url: 'https://news.google.com/rss/search?q=site:andhrajyothy.com&hl=te&gl=IN&ceid=IN:te' },
      { name: 'NT News', url: 'https://news.google.com/rss/search?q=site:ntnews.com&hl=te&gl=IN&ceid=IN:te' },
      { name: 'Namasthe Telangana', url: 'https://news.google.com/rss/search?q=site:namasthetelangana.com&hl=te&gl=IN&ceid=IN:te' },
      { name: 'TV9 Telugu', url: 'https://news.google.com/rss/search?q=site:tv9telugu.com&hl=te&gl=IN&ceid=IN:te' },
      { name: 'NTV Telugu', url: 'https://news.google.com/rss/search?q=site:ntvtelugu.com&hl=te&gl=IN&ceid=IN:te' },
      { name: 'Samayam Telugu', url: 'https://news.google.com/rss/search?q=site:telugu.samayam.com&hl=te&gl=IN&ceid=IN:te' },
      { name: 'News18 Telugu', url: 'https://news.google.com/rss/search?q=site:telugu.news18.com&hl=te&gl=IN&ceid=IN:te' },
      { name: 'Asianet Telugu', url: 'https://news.google.com/rss/search?q=site:telugu.asianetnews.com&hl=te&gl=IN&ceid=IN:te' }
    ]
  },
  bengali: {
    name: 'Bengali',
    code: 'bn',
    feeds: [
      { name: 'Anandabazar Patrika', url: 'https://news.google.com/rss/search?q=site:anandabazar.com&hl=bn&gl=IN&ceid=IN:bn' },
      { name: 'Bartaman Patrika', url: 'https://news.google.com/rss/search?q=site:bartamanpatrika.com&hl=bn&gl=IN&ceid=IN:bn' },
      { name: 'Sangbad Pratidin', url: 'https://news.google.com/rss/search?q=site:sangbadpratidin.in&hl=bn&gl=IN&ceid=IN:bn' },
      { name: 'Aajkaal', url: 'https://news.google.com/rss/search?q=site:aajkaal.in&hl=bn&gl=IN&ceid=IN:bn' },
      { name: 'Ei Samay', url: 'https://news.google.com/rss/search?q=site:eisamay.com&hl=bn&gl=IN&ceid=IN:bn' },
      { name: 'Zee News Bengali', url: 'https://news.google.com/rss/search?q=site:zeenews.india.com/bengali&hl=bn&gl=IN&ceid=IN:bn' },
      { name: 'News18 Bengali', url: 'https://news.google.com/rss/search?q=site:bengali.news18.com&hl=bn&gl=IN&ceid=IN:bn' },
      { name: 'ABP Ananda', url: 'https://news.google.com/rss/search?q=site:bengali.abplive.com&hl=bn&gl=IN&ceid=IN:bn' },
      { name: 'BBC Bengali', url: 'https://news.google.com/rss/search?q=site:bbc.com/bengali&hl=bn&gl=IN&ceid=IN:bn' },
      { name: 'TV9 Bangla', url: 'https://news.google.com/rss/search?q=site:tv9bangla.com&hl=bn&gl=IN&ceid=IN:bn' }
    ]
  },
  marathi: {
    name: 'Marathi',
    code: 'mr',
    feeds: [
      { name: 'Lokmat', url: 'https://news.google.com/rss/search?q=site:lokmat.com&hl=mr&gl=IN&ceid=IN:mr' },
      { name: 'Maharashtra Times', url: 'https://news.google.com/rss/search?q=site:maharashtratimes.com&hl=mr&gl=IN&ceid=IN:mr' },
      { name: 'Loksatta', url: 'https://news.google.com/rss/search?q=site:loksatta.com&hl=mr&gl=IN&ceid=IN:mr' },
      { name: 'Pudhari', url: 'https://news.google.com/rss/search?q=site:pudhari.news&hl=mr&gl=IN&ceid=IN:mr' },
      { name: 'Saamana', url: 'https://news.google.com/rss/search?q=site:saamana.com&hl=mr&gl=IN&ceid=IN:mr' },
      { name: 'TV9 Marathi', url: 'https://news.google.com/rss/search?q=site:tv9marathi.com&hl=mr&gl=IN&ceid=IN:mr' },
      { name: 'Zee 24 Taas', url: 'https://news.google.com/rss/search?q=site:zeenews.india.com/marathi&hl=mr&gl=IN&ceid=IN:mr' },
      { name: 'ABP Majha', url: 'https://news.google.com/rss/search?q=site:marathi.abplive.com&hl=mr&gl=IN&ceid=IN:mr' },
      { name: 'News18 Lokmat', url: 'https://news.google.com/rss/search?q=site:lokmat.news18.com&hl=mr&gl=IN&ceid=IN:mr' },
      { name: 'BBC Marathi', url: 'https://news.google.com/rss/search?q=site:bbc.com/marathi&hl=mr&gl=IN&ceid=IN:mr' }
    ]
  },
  gujarati: {
    name: 'Gujarati',
    code: 'gu',
    feeds: [
      { name: 'Divya Bhaskar', url: 'https://news.google.com/rss/search?q=site:divyabhaskar.co.in&hl=gu&gl=IN&ceid=IN:gu' },
      { name: 'Sandesh', url: 'https://news.google.com/rss/search?q=site:sandesh.com&hl=gu&gl=IN&ceid=IN:gu' },
      { name: 'Gujarat Samachar', url: 'https://news.google.com/rss/search?q=site:gujaratsamachar.com&hl=gu&gl=IN&ceid=IN:gu' },
      { name: 'NavGujarat Samay', url: 'https://news.google.com/rss/search?q=site:navgujaratsamay.com&hl=gu&gl=IN&ceid=IN:gu' },
      { name: 'VTV Gujarati', url: 'https://news.google.com/rss/search?q=site:vtvgujarati.com&hl=gu&gl=IN&ceid=IN:gu' },
      { name: 'TV9 Gujarati', url: 'https://news.google.com/rss/search?q=site:tv9gujarati.com&hl=gu&gl=IN&ceid=IN:gu' },
      { name: 'Zee News Gujarati', url: 'https://news.google.com/rss/search?q=site:zeenews.india.com/gujarati&hl=gu&gl=IN&ceid=IN:gu' },
      { name: 'BBC Gujarati', url: 'https://news.google.com/rss/search?q=site:bbc.com/gujarati&hl=gu&gl=IN&ceid=IN:gu' },
      { name: 'I am Gujarat', url: 'https://news.google.com/rss/search?q=site:iamgujarat.com&hl=gu&gl=IN&ceid=IN:gu' },
      { name: 'News18 Gujarati', url: 'https://news.google.com/rss/search?q=site:gujarati.news18.com&hl=gu&gl=IN&ceid=IN:gu' }
    ]
  },
  punjabi: {
    name: 'Punjabi',
    code: 'pa',
    feeds: [
      { name: 'Jagbani', url: 'https://news.google.com/rss/search?q=site:jagbani.punjabkesari.in&hl=pa&gl=IN&ceid=IN:pa' },
      { name: 'Punjabi Tribune', url: 'https://news.google.com/rss/search?q=site:punjabitribuneonline.com&hl=pa&gl=IN&ceid=IN:pa' },
      { name: 'Ajit Jalandhar', url: 'https://news.google.com/rss/search?q=site:ajitjalandhar.com&hl=pa&gl=IN&ceid=IN:pa' },
      { name: 'Rozana Spokesman', url: "https://news.google.com/rss/search?q=site:rozanaspokesman.in&hl=pa&gl=IN&ceid=IN:pa" },
      { name: 'PTC News', url: 'https://news.google.com/rss/search?q=site:ptcnews.tv&hl=pa&gl=IN&ceid=IN:pa' },
      { name: 'BBC Punjabi', url: 'https://news.google.com/rss/search?q=site:bbc.com/punjabi&hl=pa&gl=IN&ceid=IN:pa' },
      { name: 'News18 Punjab', url: 'https://news.google.com/rss/search?q=site:punjab.news18.com&hl=pa&gl=IN&ceid=IN:pa' },
      { name: 'Zee News Punjabi', url: 'https://news.google.com/rss/search?q=site:zeenews.india.com/punjabi&hl=pa&gl=IN&ceid=IN:pa' },
      { name: 'ABP Sanjha', url: 'https://news.google.com/rss/search?q=site:punjabi.abplive.com&hl=pa&gl=IN&ceid=IN:pa' },
      { name: 'Punjabi Jagran', url: 'https://news.google.com/rss/search?q=site:punjabi.jagran.com&hl=pa&gl=IN&ceid=IN:pa' }
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

    // Shuffle feeds to pick a random order
    const shuffledFeeds = [...langInfo.feeds].sort(() => 0.5 - Math.random());
    let successfulFeedsCount = 0;

    for (const source of shuffledFeeds) {
      if (successfulFeedsCount >= 5) break;

      try {
        console.log(`Fetching ${source.name} RSS feed...`);
        const feed = await parser.parseURL(source.url);
        
        let foundNewItems = false;

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
          foundNewItems = true;

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
        
        if (foundNewItems) {
          successfulFeedsCount++;
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
