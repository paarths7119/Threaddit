import React, { useEffect, useState } from 'react'
import { Plus, TrendingUp, Clock, Flame, Filter, Users, Sparkles, AlertCircle } from 'lucide-react'
import API from '../api'
import PostCard from '../components/PostCard'
import PostForm from '../components/PostForm'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('hot') // hot, new, top, trending
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [filterTag, setFilterTag] = useState(null)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('threaddit_user')
    if (userData) setUser(JSON.parse(userData))
  }, [])

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await API.get('/posts', {
        params: { 
          sort: sortBy,
          tag: filterTag 
        }
      })
      setPosts(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load posts')
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [sortBy, filterTag])

  const popularTags = ['javascript', 'react', 'python', 'web-dev', 'tech']
  const trendingCommunities = [
    { name: 'Technology', members: '2.5M', icon: '💻' },
    { name: 'Programming', members: '1.8M', icon: '🚀' },
    { name: 'AskThreaddit', members: '3.2M', icon: '❓' },
    { name: 'Science', members: '1.1M', icon: '🔬' },
    { name: 'Gaming', members: '2.9M', icon: '🎮' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Create Post Card */}
            {user && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="flex-1 text-left px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-full text-gray-500 transition-colors"
                  >
                    Create Post
                  </button>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="p-2.5 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Create Post Modal/Form */}
            {showCreatePost && (
              <div className="mb-4">
                <PostForm 
                  onCreate={() => {
                    load()
                    setShowCreatePost(false)
                  }} 
                  onClose={() => setShowCreatePost(false)}
                />
              </div>
            )}

            {/* Sort Tabs */}
            <div className="bg-white rounded-lg border border-gray-200 p-2 mb-4 flex items-center justify-between shadow-sm">
              <div className="flex space-x-1">
                <button
                  onClick={() => setSortBy('hot')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
                    sortBy === 'hot'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Flame className={`w-4 h-4 ${sortBy === 'hot' ? 'text-orange-500' : ''}`} />
                  <span>Hot</span>
                </button>
                <button
                  onClick={() => setSortBy('new')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
                    sortBy === 'new'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${sortBy === 'new' ? 'text-blue-500' : ''}`} />
                  <span>New</span>
                </button>
                <button
                  onClick={() => setSortBy('top')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
                    sortBy === 'top'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <TrendingUp className={`w-4 h-4 ${sortBy === 'top' ? 'text-green-500' : ''}`} />
                  <span>Top</span>
                </button>
                <button
                  onClick={() => setSortBy('trending')}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg transition-all ${
                    sortBy === 'trending'
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Clock className={`w-4 h-4 ${sortBy === 'trending' ? 'text-purple-500' : ''}`} />
                  <span>Trending</span>
                </button>
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Active Filter Display */}
            {filterTag && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-900">
                    Filtering by: <span className="font-medium">#{filterTag}</span>
                  </span>
                </div>
                <button
                  onClick={() => setFilterTag(null)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filter
                </button>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">Error loading posts</p>
                  <p className="text-sm text-red-600">{error}</p>
                  <button
                    onClick={load}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                    <div className="flex space-x-4">
                      <div className="w-10 h-20 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} onUpdate={load} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filterTag ? 'No posts found with this tag' : 'No posts yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {user 
                    ? filterTag 
                      ? 'Try browsing other tags or create the first post with this tag!'
                      : 'Be the first to share something interesting with the community!'
                    : 'Log in to create posts and join the conversation.'
                  }
                </p>
                {user && !filterTag && (
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="px-6 py-2.5 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors"
                  >
                    Create First Post
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            {/* About Card */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-4 sticky top-20">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 h-16"></div>
              <div className="p-4 -mt-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-lg mb-3">
                  <span className="text-3xl font-bold text-orange-500">T</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Home</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your personal Threaddit frontpage. Come here to check in with your favorite communities.
                </p>
                
                {user ? (
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="w-full py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium mb-2"
                  >
                    Create Post
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="w-full py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium mb-2"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => window.location.href = '/register'}
                      className="w-full py-2.5 border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors font-medium"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span>Popular Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filterTag === tag
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Communities */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>Trending Communities</span>
              </h3>
              <div className="space-y-3">
                {trendingCommunities.map((community, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl">
                        {community.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">t/{community.name}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Users className="w-3 h-3" />
                          <span>{community.members} members</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-3 py-1 text-xs border border-orange-500 text-orange-500 rounded-full hover:bg-orange-50 transition-colors font-medium">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="mt-4 px-4 text-xs text-gray-500 space-y-2">
              <div className="flex flex-wrap gap-2">
                <a href="/about" className="hover:underline">About</a>
                <span>•</span>
                <a href="/help" className="hover:underline">Help</a>
                <span>•</span>
                <a href="/terms" className="hover:underline">Terms</a>
                <span>•</span>
                <a href="/privacy" className="hover:underline">Privacy</a>
              </div>
              <p>© 2024 Threaddit, Inc. All rights reserved.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}