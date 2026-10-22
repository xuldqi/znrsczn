/* eslint react-refresh/only-export-components: "off" */
import { createContext, useContext, useEffect, useState } from 'react'

const CategoryContext = createContext()
const API_BASE_URL = '/api'

const api = {
  async fetchCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) {
        throw new Error('获取分类失败')
      }
      return await response.json()
    } catch (error) {
      console.error('获取分类失败:', error)
      throw error
    }
  },
  async createCategory(payload) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(errorBody.error || '创建分类失败')
    }
    return await response.json()
  },
  async updateCategory(id, updates) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(errorBody.error || '更新分类失败')
    }
    return await response.json()
  },
  async deleteCategory(id) {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(errorBody.error || '删除分类失败')
    }
    return true
  }
}

const defaultCategories = [
  { id: 'career', name: '职场发展', color: '#2563eb', order: 1 },
  { id: 'transformation', name: '转型升级', color: '#7c3aed', order: 2 },
  { id: 'side-business', name: '副业指南', color: '#059669', order: 3 },
  { id: 'finance', name: '财务管理', color: '#d97706', order: 4 },
  { id: 'midlife-crisis', name: '中年危机', color: '#dc2626', order: 5 },
  { id: 'psychology', name: '心理健康', color: '#0891b2', order: 6 },
  { id: 'family', name: '家庭关系', color: '#ec4899', order: 7 },
  { id: 'life-skills', name: '生活技能', color: '#10b981', order: 8 },
  { id: 'interests', name: '兴趣爱好', color: '#8b5cf6', order: 9 }
]

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState(defaultCategories)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.fetchCategories()
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data)
      } else {
        setCategories(defaultCategories)
      }
    } catch (err) {
      setError(err.message || '获取分类失败')
      setCategories(defaultCategories)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const addCategory = async (payload) => {
    const created = await api.createCategory(payload)
    setCategories(prev => [...prev, created].sort((a, b) => (a.order || 0) - (b.order || 0)))
    return created
  }

  const updateCategory = async (id, updates) => {
    const updated = await api.updateCategory(id, updates)
    setCategories(prev =>
      prev
        .map(item => (item.id === id ? updated : item))
        .sort((a, b) => (a.order || 0) - (b.order || 0))
    )
    return updated
  }

  const deleteCategory = async (id) => {
    await api.deleteCategory(id)
    setCategories(prev => prev.filter(item => item.id !== id))
  }

  const contextValue = {
    categories,
    loading,
    error,
    refreshCategories: loadCategories,
    addCategory,
    updateCategory,
    deleteCategory
  }

  return (
    <CategoryContext.Provider value={contextValue}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = () => {
  const context = useContext(CategoryContext)
  if (!context) {
    throw new Error('useCategories 必须在 CategoryProvider 中使用')
  }
  return context
}
