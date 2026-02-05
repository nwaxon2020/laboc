import Link from 'next/link'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
}

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">{post.readTime}</span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <time className="text-gray-500 text-sm">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span className="text-gray-800 font-medium hover:text-gray-600 transition">
              Read more →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}