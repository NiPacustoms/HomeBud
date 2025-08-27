import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Modal {
  id: string
  type: 'create-project' | 'edit-project' | 'delete-project' | 'create-entry' | 'edit-entry' | 'delete-entry' | 'create-post' | 'edit-post' | 'delete-post' | 'settings' | 'profile' | 'help' | 'about' | 'custom'
  isOpen: boolean
  data?: any
  onConfirm?: () => void
  onCancel?: () => void
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  isPersistent?: boolean
  actions?: {
    label: string
    action: () => void
  }[]
  createdAt: Date
}

export interface SidebarState {
  isOpen: boolean
  activeSection: string | null
  expandedSections: string[]
}

export interface BottomNavState {
  activeTab: 'dashboard' | 'planning' | 'monitoring' | 'diary' | 'community'
  isVisible: boolean
}

interface UIState {
  theme: 'light' | 'dark' | 'system'
  sidebar: SidebarState
  bottomNav: BottomNavState
  modals: Modal[]
  notifications: Notification[]
  loadingStates: {
    [key: string]: boolean
  }
  errors: {
    [key: string]: string | null
  }
  isOnline: boolean
  isMobile: boolean
  screenSize: {
    width: number
    height: number
  }
  scrollPosition: {
    [key: string]: number
  }
  searchQuery: string
  filters: {
    [key: string]: any
  }
  sortOptions: {
    [key: string]: string
  }
  selectedItems: {
    [key: string]: string[]
  }
  expandedItems: {
    [key: string]: string[]
  }
  formData: {
    [key: string]: any
  }
  lastAction: {
    type: string
    timestamp: Date
    data?: any
  } | null
}

const initialState: UIState = {
  theme: 'system',
  sidebar: {
    isOpen: false,
    activeSection: null,
    expandedSections: [],
  },
  bottomNav: {
    activeTab: 'dashboard',
    isVisible: true,
  },
  modals: [],
  notifications: [],
  loadingStates: {},
  errors: {},
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  screenSize: {
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  },
  scrollPosition: {},
  searchQuery: '',
  filters: {},
  sortOptions: {},
  selectedItems: {},
  expandedItems: {},
  formData: {},
  lastAction: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen
    },
    openSidebar: (state) => {
      state.sidebar.isOpen = true
    },
    closeSidebar: (state) => {
      state.sidebar.isOpen = false
    },
    setSidebarActiveSection: (state, action: PayloadAction<string | null>) => {
      state.sidebar.activeSection = action.payload
    },
    toggleSidebarSection: (state, action: PayloadAction<string>) => {
      const section = action.payload
      const index = state.sidebar.expandedSections.indexOf(section)
      if (index === -1) {
        state.sidebar.expandedSections.push(section)
      } else {
        state.sidebar.expandedSections.splice(index, 1)
      }
    },
    setBottomNavActiveTab: (state, action: PayloadAction<BottomNavState['activeTab']>) => {
      state.bottomNav.activeTab = action.payload
    },
    setBottomNavVisibility: (state, action: PayloadAction<boolean>) => {
      state.bottomNav.isVisible = action.payload
    },
    openModal: (state, action: PayloadAction<Omit<Modal, 'isOpen'>>) => {
      const existingIndex = state.modals.findIndex(m => m.id === action.payload.id)
      if (existingIndex !== -1) {
        state.modals[existingIndex] = { ...action.payload, isOpen: true }
      } else {
        state.modals.push({ ...action.payload, isOpen: true })
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modalIndex = state.modals.findIndex(m => m.id === action.payload)
      if (modalIndex !== -1) {
        state.modals[modalIndex].isOpen = false
      }
    },
    closeAllModals: (state) => {
      state.modals.forEach(modal => {
        modal.isOpen = false
      })
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
      }
      state.notifications.unshift(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    setLoadingState: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      const { key, isLoading } = action.payload
      state.loadingStates[key] = isLoading
    },
    clearLoadingState: (state, action: PayloadAction<string>) => {
      delete state.loadingStates[action.payload]
    },
    setError: (state, action: PayloadAction<{ key: string; error: string | null }>) => {
      const { key, error } = action.payload
      state.errors[key] = error
    },
    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload]
    },
    clearAllErrors: (state) => {
      state.errors = {}
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
    },
    setMobileStatus: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload
    },
    setScreenSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.screenSize = action.payload
    },
    setScrollPosition: (state, action: PayloadAction<{ key: string; position: number }>) => {
      const { key, position } = action.payload
      state.scrollPosition[key] = position
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = action.payload
      state.filters[key] = value
    },
    clearFilter: (state, action: PayloadAction<string>) => {
      delete state.filters[action.payload]
    },
    clearAllFilters: (state) => {
      state.filters = {}
    },
    setSortOption: (state, action: PayloadAction<{ key: string; option: string }>) => {
      const { key, option } = action.payload
      state.sortOptions[key] = option
    },
    clearSortOption: (state, action: PayloadAction<string>) => {
      delete state.sortOptions[action.payload]
    },
    setSelectedItems: (state, action: PayloadAction<{ key: string; items: string[] }>) => {
      const { key, items } = action.payload
      state.selectedItems[key] = items
    },
    addSelectedItem: (state, action: PayloadAction<{ key: string; item: string }>) => {
      const { key, item } = action.payload
      if (!state.selectedItems[key]) {
        state.selectedItems[key] = []
      }
      if (!state.selectedItems[key].includes(item)) {
        state.selectedItems[key].push(item)
      }
    },
    removeSelectedItem: (state, action: PayloadAction<{ key: string; item: string }>) => {
      const { key, item } = action.payload
      if (state.selectedItems[key]) {
        state.selectedItems[key] = state.selectedItems[key].filter(i => i !== item)
      }
    },
    clearSelectedItems: (state, action: PayloadAction<string>) => {
      delete state.selectedItems[action.payload]
    },
    setExpandedItems: (state, action: PayloadAction<{ key: string; items: string[] }>) => {
      const { key, items } = action.payload
      state.expandedItems[key] = items
    },
    toggleExpandedItem: (state, action: PayloadAction<{ key: string; item: string }>) => {
      const { key, item } = action.payload
      if (!state.expandedItems[key]) {
        state.expandedItems[key] = []
      }
      const index = state.expandedItems[key].indexOf(item)
      if (index === -1) {
        state.expandedItems[key].push(item)
      } else {
        state.expandedItems[key].splice(index, 1)
      }
    },
    setFormData: (state, action: PayloadAction<{ key: string; data: any }>) => {
      const { key, data } = action.payload
      state.formData[key] = data
    },
    clearFormData: (state, action: PayloadAction<string>) => {
      delete state.formData[action.payload]
    },
    clearAllFormData: (state) => {
      state.formData = {}
    },
    setLastAction: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.lastAction = {
        type: action.payload.type,
        timestamp: new Date(),
        data: action.payload.data,
      }
    },
    clearLastAction: (state) => {
      state.lastAction = null
    },
    resetUI: (state) => {
      state.modals = []
      state.notifications = []
      state.loadingStates = {}
      state.errors = {}
      state.searchQuery = ''
      state.filters = {}
      state.sortOptions = {}
      state.selectedItems = {}
      state.expandedItems = {}
      state.formData = {}
      state.lastAction = null
    },
  },
})

export const {
  setTheme,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  setSidebarActiveSection,
  toggleSidebarSection,
  setBottomNavActiveTab,
  setBottomNavVisibility,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoadingState,
  clearLoadingState,
  setError,
  clearError,
  clearAllErrors,
  setOnlineStatus,
  setMobileStatus,
  setScreenSize,
  setScrollPosition,
  setSearchQuery,
  setFilter,
  clearFilter,
  clearAllFilters,
  setSortOption,
  clearSortOption,
  setSelectedItems,
  addSelectedItem,
  removeSelectedItem,
  clearSelectedItems,
  setExpandedItems,
  toggleExpandedItem,
  setFormData,
  clearFormData,
  clearAllFormData,
  setLastAction,
  clearLastAction,
  resetUI,
} = uiSlice.actions

export default uiSlice.reducer
