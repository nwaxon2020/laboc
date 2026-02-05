import BlogCard from '@/components/blog/BlogCard'

export default function BlogPageUi() {
  const blogPosts = [
    {
      id: 1,
      title: 'Understanding the Grieving Process',
      excerpt: 'Learn about the different stages of grief and how to support yourself or others through difficult times.',
      date: '2024-01-15',
      category: 'Grief Support',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'The Benefits of Pre-Planning Funeral Arrangements',
      excerpt: 'Discover how pre-planning can provide peace of mind and relieve your family of difficult decisions.',
      date: '2024-01-10',
      category: 'Pre-Planning',
      readTime: '4 min read'
    },
    {
      id: 3,
      title: 'Traditional vs. Cremation: Making the Right Choice',
      excerpt: 'A comprehensive guide to help you understand the options and make informed decisions.',
      date: '2024-01-05',
      category: 'Services',
      readTime: '6 min read'
    },
    {
      id: 4,
      title: 'Creating Meaningful Memorial Services',
      excerpt: 'Tips for personalizing memorial services to truly honor your loved one\'s life and legacy.',
      date: '2023-12-20',
      category: 'Memorials',
      readTime: '5 min read'
    },
    {
      id: 5,
      title: 'Supporting Children Through Loss',
      excerpt: 'Guidance on helping children understand and cope with the loss of a loved one.',
      date: '2023-12-15',
      category: 'Family Support',
      readTime: '7 min read'
    },
    {
      id: 6,
      title: 'Navigating Funeral Costs and Insurance',
      excerpt: 'Understanding funeral expenses and how insurance can help cover the costs.',
      date: '2023-12-10',
      category: 'Financial Planning',
      readTime: '8 min read'
    }
  ]

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Funeral Services Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Helpful resources, guidance, and support for families navigating difficult times.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-gray-600">
            More articles coming soon. Subscribe to stay updated.
          </p>
        </div>
      </div>
    </div>
  )
}