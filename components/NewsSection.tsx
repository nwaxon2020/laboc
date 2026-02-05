"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaRegClock, FaExternalLinkAlt } from "react-icons/fa";

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

export default function NewsSection() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        const validNews = data.filter((art: Article) => art.urlToImage && art.title !== "[Removed]");
        setNews(validNews.slice(0, 8));
      } catch (err) {
        console.error("News fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  if (loading) return (
    <div className="py-20 text-center text-slate-400 font-medium">Loading tributes...</div>
  );

  return (
    <section className="py-8 bg-slate-50 text-slate-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 border-l-4 border-blue-600 pl-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2 text-slate-900">
            Global <span className="text-blue-600 italic font-light tracking-tight">Tributes</span>
          </h2>
          <p className="text-slate-500 max-w-xl text-sm font-medium uppercase tracking-widest">
            Notable passings and world-class memorials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((article, i) => (
            <motion.a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 hover:border-blue-200 transition-all duration-300 flex flex-col"
            >
              {/* Compact Image h-40 */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-[9px] font-black text-white uppercase px-3 py-1.5 rounded-bl-lg shadow-lg">
                  {article.source.name}
                </div>
              </div>

              <div className="px-6 py-4 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-blue-600/60 text-[10px] mb-3 uppercase tracking-widest font-bold">
                  <FaRegClock />
                  {new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                
                <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug text-slate-800">
                  {article.title}
                </h3>
                
                <p className="text-slate-500 text-[11px] line-clamp-2 mb-6 leading-relaxed flex-grow">
                  {article.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-blue-600 text-[10px] font-black uppercase tracking-tighter group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                    View Report <FaExternalLinkAlt size={8} />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}