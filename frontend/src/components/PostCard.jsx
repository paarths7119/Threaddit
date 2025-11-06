import React, { useState } from 'react'
import { ArrowUp, ArrowDown, MessageSquare, Share2, Bookmark, MoreHorizontal, Flag, Award, Eye } from 'lucide-react'
import API from '../api'

export default function PostCard({ post, onUpdate }) {
  const [comment, setComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [userVote, setUserVote] = useState(null)
  const [showOptions, setShowOptions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const upvote = async () => {
    try {
      await API.post(`/posts/${post._id}/upvote`)
      setUserVote(userVote === 'up' ? null : 'up')
      onUpdate()
    } catch (error) {
      console.error('Error upvoting:', error)
    }
  }

  const downvote = async () => {
    try {
      await API.post(`/posts/${post._id}/downvote`)
      setUserVote(userVote === 'down' ? null : 'down')
      onUpdate()
    } catch (error) {
      console.error('Error downvoting:', error)
    }
  }

  const submitComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    
    setIsSubmitting(true)
    try {
      await API.post(`/posts/${post._id}/comments`, { text: comment })
      setComment('')
      onUpdate()
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalVotes = (post.upvotes?.length || 0) - (post.downvotes?.length || 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all mb-4 overflow-hidden">
      <div className="flex">
        {/* Vote Section */}
        <div className="flex flex-col items-center bg-gray-50 px-4 py-4 space-y-1">
          <button
            onClick={upvote}
            className={`p-1 rounded hover:bg-orange-100 transition-colors ${
              userVote === 'up' ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
            }`}
            aria-label="Upvote"
          >
            <ArrowUp className={`w-6 h-6 ${userVote === 'up' ? 'fill-current' : ''}`} />
          </button>
          <span className={`text-sm font-bold min-w-[2rem] text-center ${
            userVote === 'up' ? 'text-orange-500' : userVote === 'down' ? 'text-blue-500' : 'text-gray-900'
          }`}>
            {totalVotes >= 1000 ? `${(totalVotes / 1000).toFixed(1)}k` : totalVotes}
          </span>
          <button
            onClick={downvote}
            className={`p-1 rounded hover:bg-blue-100 transition-colors ${
              userVote === 'down' ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
            }`}
            aria-label="Downvote"
          >
            <ArrowDown className={`w-6 h-6 ${userVote === 'down' ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4">
          {/* Post Header */}
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
            <div className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {post.author?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <span className="font-medium text-gray-700 hover:underline cursor-pointer">
                u/{post.author?.username || 'anonymous'}
              </span>
            </div>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            {post.views && (
              <>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.views}</span>
                </div>
              </>
            )}
          </div>

          {/* Post Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
            {post.title}
          </h2>

          {/* Post Body */}
          {post.body && (
            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.body}</p>
          )}

          {/* Post Image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full max-h-96 object-cover rounded-lg mb-3 cursor-pointer hover:opacity-95 transition-opacity"
            />
          )}

          {/* Awards Section */}
          {post.awards && post.awards.length > 0 && (
            <div className="flex items-center space-x-2 mb-3">
              {post.awards.map((award, idx) => (
                <div key={idx} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium">{award.count}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 text-gray-500">
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-medium">
                {post.comments?.length || 0} {post.comments?.length === 1 ? 'Comment' : 'Comments'}
              </span>
            </button>
            
            <button className="flex items-center space-x-1 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Award</span>
            </button>

            <button className="flex items-center space-x-1 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>

            <button className="flex items-center space-x-1 px-3 py-1.5 hover:bg-gray-100 rounded-md transition-colors">
              <Bookmark className="w-5 h-5" />
              <span className="text-sm font-medium">Save</span>
            </button>

            <div className="relative ml-auto">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700 w-full text-left">
                    <Flag className="w-4 h-4" />
                    <span className="text-sm">Report</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-gray-700 w-full text-left">
                    <Bookmark className="w-4 h-4" />
                    <span className="text-sm">Hide</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {/* Comment Form */}
              <form onSubmit={submitComment} className="mb-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What are your thoughts?"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows="3"
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    type="button"
                    onClick={() => setComment('')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!comment.trim() || isSubmitting}
                    className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {post.comments?.length > 0 ? (
                  post.comments.map((c) => (
                    <div key={c._id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {c.author?.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {c.author?.username || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{c.text}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <button className="text-xs text-gray-500 hover:text-orange-500 font-medium">
                            Reply
                          </button>
                          <button className="text-xs text-gray-500 hover:text-orange-500 font-medium">
                            Award
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}