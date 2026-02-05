import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY; // Ensure this is in your .env.local
  const query = encodeURIComponent('"passed away" OR "died" OR "tribute to" OR "obituary"');
  
  // We filter by 'entertainment' category and relevant keywords
  const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=8&apiKey=${apiKey}&language=en`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    const data = await response.json();

    if (data.status !== 'ok') {
      return NextResponse.json({ error: data.message }, { status: 500 });
    }

    return NextResponse.json(data.articles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}