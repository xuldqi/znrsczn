import { createContext, useContext, useState, useEffect } from 'react'

// 创建文章上下文
const ArticleContext = createContext()

// API 基础URL
const API_BASE_URL = '/api'

// API 辅助函数
const api = {
  // 获取所有文章
  async getArticles() {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`)
      if (!response.ok) throw new Error('获取文章失败')
      const articles = await response.json()
      
      // 转换数组格式为对象格式（保持原有接口兼容）
      const articlesObj = {}
      articles.forEach(article => {
        articlesObj[article.id] = article
      })
      return articlesObj
    } catch (error) {
      console.error('获取文章失败:', error)
      return {}
    }
  },

  // 添加文章
  async addArticle(articleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData)
      })
      if (!response.ok) throw new Error('添加文章失败')
      return await response.json()
    } catch (error) {
      console.error('添加文章失败:', error)
      throw error
    }
  },

  // 更新文章
  async updateArticle(id, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('更新文章失败')
      return await response.json()
    } catch (error) {
      console.error('更新文章失败:', error)
      throw error
    }
  },

  // 删除文章
  async deleteArticle(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('删除文章失败')
      return true
    } catch (error) {
      console.error('删除文章失败:', error)
      throw error
    }
  }
}

export const ArticleProvider = ({ children }) => {
  const [articles, setArticles] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 从API加载数据
  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const articlesData = await api.getArticles()
      setArticles(articlesData)
    } catch (error) {
      setError(error.message)
      console.error('加载文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 获取单篇文章
  const getArticle = (id) => {
    return articles[id] || null
  }

  // 获取所有文章
  const getAllArticles = () => {
    return Object.values(articles)
  }

  // 按分类获取文章
  const getArticlesByCategory = (category) => {
    return Object.values(articles).filter(article => 
      article.category === category && article.status === 'published'
    )
  }

  // 获取已发布的文章
  const getPublishedArticles = () => {
    return Object.values(articles).filter(article => article.status === 'published')
  }

  // 添加新文章
  const addArticle = async (articleData) => {
    try {
      const newArticle = await api.addArticle(articleData)
      setArticles(prev => ({
        ...prev,
        [newArticle.id]: newArticle
      }))
      return newArticle.id
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // 更新文章
  const updateArticle = async (id, updates) => {
    try {
      const updatedArticle = await api.updateArticle(id, updates)
      setArticles(prev => ({
        ...prev,
        [id]: updatedArticle
      }))
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // 删除文章
  const deleteArticle = async (id) => {
    try {
      await api.deleteArticle(id)
      setArticles(prev => {
        const newArticles = { ...prev }
        delete newArticles[id]
        return newArticles
      })
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  // 刷新文章列表
  const refreshArticles = () => {
    loadArticles()
  }

  const contextValue = {
    articles,
    loading,
    error,
    getArticle,
    getAllArticles,
    getArticlesByCategory,
    getPublishedArticles,
    addArticle,
    updateArticle,
    deleteArticle,
    refreshArticles
  }

  return (
    <ArticleContext.Provider value={contextValue}>
      {children}
    </ArticleContext.Provider>
  )
}

// 使用文章上下文的Hook
export const useArticles = () => {
  const context = useContext(ArticleContext)
  if (!context) {
    throw new Error('useArticles must be used within an ArticleProvider')
  }
  return context
}

export default ArticleContext