import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  title: string
  content: string
  images: {
    id: string
    url: string
    caption?: string
  }[]
  tags: string[]
  category: 'general' | 'growing' | 'strains' | 'equipment' | 'legal' | 'harvest' | 'curing' | 'problems' | 'success'
  likes: string[] // user IDs
  dislikes: string[] // user IDs
  comments: Comment[]
  isPublic: boolean
  isPinned: boolean
  isLocked: boolean
  viewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  likes: string[]
  dislikes: string[]
  replies: Comment[]
  isEdited: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Mentor {
  id: string
  userId: string
  name: string
  avatar?: string
  bio: string
  expertise: string[]
  experience: number // years
  rating: number
  reviewCount: number
  hourlyRate: number
  currency: 'EUR' | 'USD'
  availability: {
    monday: { start: string; end: string }[]
    tuesday: { start: string; end: string }[]
    wednesday: { start: string; end: string }[]
    thursday: { start: string; end: string }[]
    friday: { start: string; end: string }[]
    saturday: { start: string; end: string }[]
    sunday: { start: string; end: string }[]
  }
  languages: string[]
  isVerified: boolean
  isOnline: boolean
  createdAt: Date
}

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  type: 'text' | 'image' | 'file' | 'system'
  isRead: boolean
  createdAt: Date
}

export interface Chat {
  id: string
  participants: string[]
  lastMessage?: ChatMessage
  unreadCount: number
  isGroup: boolean
  groupName?: string
  groupAvatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Competition {
  id: string
  title: string
  description: string
  imageUrl?: string
  startDate: Date
  endDate: Date
  prize: {
    description: string
    value: number
    currency: 'EUR' | 'USD'
  }
  participants: string[]
  judges: string[]
  criteria: string[]
  status: 'upcoming' | 'active' | 'judging' | 'completed'
  winner?: string
  createdAt: Date
}

interface CommunityState {
  posts: CommunityPost[]
  currentPost: CommunityPost | null
  mentors: Mentor[]
  chats: Chat[]
  currentChat: Chat | null
  messages: ChatMessage[]
  competitions: Competition[]
  isLoading: boolean
  error: string | null
  filters: {
    category: string[]
    tags: string[]
    author: string[]
    dateRange: { start: Date | null; end: Date | null }
  }
  searchQuery: string
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending'
}

const initialState: CommunityState = {
  posts: [],
  currentPost: null,
  mentors: [],
  chats: [],
  currentChat: null,
  messages: [],
  competitions: [],
  isLoading: false,
  error: null,
  filters: {
    category: [],
    tags: [],
    author: [],
    dateRange: { start: null, end: null },
  },
  searchQuery: '',
  sortBy: 'newest',
}

// Async thunks
export const fetchPosts = createAsyncThunk(
  'community/fetchPosts',
  async ({ filters, sortBy }: { filters?: any; sortBy?: string }) => {
    // TODO: Implement API call
    return []
  }
)

export const createPost = createAsyncThunk(
  'community/createPost',
  async (post: Omit<CommunityPost, 'id' | 'likes' | 'dislikes' | 'comments' | 'viewCount' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Implement API call
    return { ...post, id: 'temp-id', likes: [], dislikes: [], comments: [], viewCount: 0, createdAt: new Date(), updatedAt: new Date() }
  }
)

export const updatePost = createAsyncThunk(
  'community/updatePost',
  async ({ id, updates }: { id: string; updates: Partial<CommunityPost> }) => {
    // TODO: Implement API call
    return { id, updates }
  }
)

export const deletePost = createAsyncThunk(
  'community/deletePost',
  async (id: string) => {
    // TODO: Implement API call
    return id
  }
)

export const likePost = createAsyncThunk(
  'community/likePost',
  async ({ postId, userId }: { postId: string; userId: string }) => {
    // TODO: Implement API call
    return { postId, userId }
  }
)

export const addComment = createAsyncThunk(
  'community/addComment',
  async (comment: Omit<Comment, 'id' | 'likes' | 'dislikes' | 'replies' | 'isEdited' | 'createdAt' | 'updatedAt'>) => {
    // TODO: Implement API call
    return { ...comment, id: 'temp-id', likes: [], dislikes: [], replies: [], isEdited: false, createdAt: new Date(), updatedAt: new Date() }
  }
)

export const fetchMentors = createAsyncThunk(
  'community/fetchMentors',
  async () => {
    // TODO: Implement API call
    return []
  }
)

export const fetchChats = createAsyncThunk(
  'community/fetchChats',
  async () => {
    // TODO: Implement API call
    return []
  }
)

export const fetchMessages = createAsyncThunk(
  'community/fetchMessages',
  async (chatId: string) => {
    // TODO: Implement API call
    return []
  }
)

export const sendMessage = createAsyncThunk(
  'community/sendMessage',
  async (message: Omit<ChatMessage, 'id' | 'isRead' | 'createdAt'>) => {
    // TODO: Implement API call
    return { ...message, id: 'temp-id', isRead: false, createdAt: new Date() }
  }
)

export const fetchCompetitions = createAsyncThunk(
  'community/fetchCompetitions',
  async () => {
    // TODO: Implement API call
    return []
  }
)

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setCurrentPost: (state, action: PayloadAction<CommunityPost | null>) => {
      state.currentPost = action.payload
    },
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload
    },
    addPost: (state, action: PayloadAction<CommunityPost>) => {
      state.posts.unshift(action.payload)
    },
    updatePostLocal: (state, action: PayloadAction<{ id: string; updates: Partial<CommunityPost> }>) => {
      const { id, updates } = action.payload
      const postIndex = state.posts.findIndex(p => p.id === id)
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates, updatedAt: new Date() }
      }
      if (state.currentPost?.id === id) {
        state.currentPost = { ...state.currentPost, ...updates, updatedAt: new Date() }
      }
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload)
      if (state.currentPost?.id === action.payload) {
        state.currentPost = null
      }
    },
    addCommentToPost: (state, action: PayloadAction<{ postId: string; comment: Comment }>) => {
      const { postId, comment } = action.payload
      const postIndex = state.posts.findIndex(p => p.id === postId)
      if (postIndex !== -1) {
        state.posts[postIndex].comments.push(comment)
      }
      if (state.currentPost?.id === postId) {
        state.currentPost.comments.push(comment)
      }
    },
    updateCommentLocal: (state, action: PayloadAction<{ postId: string; commentId: string; updates: Partial<Comment> }>) => {
      const { postId, commentId, updates } = action.payload
      const updateCommentInPost = (post: CommunityPost) => {
        const commentIndex = post.comments.findIndex(c => c.id === commentId)
        if (commentIndex !== -1) {
          post.comments[commentIndex] = { ...post.comments[commentIndex], ...updates, updatedAt: new Date() }
        }
      }
      
      const postIndex = state.posts.findIndex(p => p.id === postId)
      if (postIndex !== -1) {
        updateCommentInPost(state.posts[postIndex])
      }
      if (state.currentPost?.id === postId) {
        updateCommentInPost(state.currentPost)
      }
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
      // Update last message in chat
      const chatIndex = state.chats.findIndex(c => c.id === action.payload.chatId)
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = action.payload
        state.chats[chatIndex].updatedAt = new Date()
        if (state.currentChat?.id === action.payload.chatId) {
          state.currentChat.lastMessage = action.payload
          state.currentChat.updatedAt = new Date()
        }
      }
    },
    markMessageAsRead: (state, action: PayloadAction<string>) => {
      const messageIndex = state.messages.findIndex(m => m.id === action.payload)
      if (messageIndex !== -1) {
        state.messages[messageIndex].isRead = true
      }
    },
    setFilters: (state, action: PayloadAction<Partial<CommunityState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        category: [],
        tags: [],
        author: [],
        dateRange: { start: null, end: null },
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSortBy: (state, action: PayloadAction<CommunityState['sortBy']>) => {
      state.sortBy = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Fehler beim Laden der Beiträge'
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload)
        state.currentPost = action.payload
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const { id, updates } = action.payload
        const postIndex = state.posts.findIndex(p => p.id === id)
        if (postIndex !== -1) {
          state.posts[postIndex] = { ...state.posts[postIndex], ...updates, updatedAt: new Date() }
        }
        if (state.currentPost?.id === id) {
          state.currentPost = { ...state.currentPost, ...updates, updatedAt: new Date() }
        }
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p.id !== action.payload)
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null
        }
      })
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, userId } = action.payload
        const postIndex = state.posts.findIndex(p => p.id === postId)
        if (postIndex !== -1) {
          const post = state.posts[postIndex]
          const likeIndex = post.likes.indexOf(userId)
          const dislikeIndex = post.dislikes.indexOf(userId)
          
          if (likeIndex === -1) {
            post.likes.push(userId)
          } else {
            post.likes.splice(likeIndex, 1)
          }
          
          if (dislikeIndex !== -1) {
            post.dislikes.splice(dislikeIndex, 1)
          }
        }
        if (state.currentPost?.id === postId) {
          const likeIndex = state.currentPost.likes.indexOf(userId)
          const dislikeIndex = state.currentPost.dislikes.indexOf(userId)
          
          if (likeIndex === -1) {
            state.currentPost.likes.push(userId)
          } else {
            state.currentPost.likes.splice(likeIndex, 1)
          }
          
          if (dislikeIndex !== -1) {
            state.currentPost.dislikes.splice(dislikeIndex, 1)
          }
        }
      })
      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const comment = action.payload
        const postIndex = state.posts.findIndex(p => p.id === comment.postId)
        if (postIndex !== -1) {
          state.posts[postIndex].comments.push(comment)
        }
        if (state.currentPost?.id === comment.postId) {
          state.currentPost.comments.push(comment)
        }
      })
      // Fetch mentors
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.mentors = action.payload
      })
      // Fetch chats
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload
      })
      // Fetch messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload
      })
      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload)
        // Update last message in chat
        const chatIndex = state.chats.findIndex(c => c.id === action.payload.chatId)
        if (chatIndex !== -1) {
          state.chats[chatIndex].lastMessage = action.payload
          state.chats[chatIndex].updatedAt = new Date()
        }
        if (state.currentChat?.id === action.payload.chatId) {
          state.currentChat.lastMessage = action.payload
          state.currentChat.updatedAt = new Date()
        }
      })
      // Fetch competitions
      .addCase(fetchCompetitions.fulfilled, (state, action) => {
        state.competitions = action.payload
      })
  },
})

export const {
  setCurrentPost,
  setCurrentChat,
  addPost,
  updatePostLocal,
  removePost,
  addCommentToPost,
  updateCommentLocal,
  addMessage,
  markMessageAsRead,
  setFilters,
  clearFilters,
  setSearchQuery,
  setSortBy,
  setLoading,
  setError,
  clearError,
} = communitySlice.actions

export default communitySlice.reducer
