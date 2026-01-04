/* eslint react-refresh/only-export-components: "off" */
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Safe localStorage helpers to handle restricted contexts
  const safeGetItem = (key) => {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.warn('localStorage access denied:', e)
      return null
    }
  }

  const safeSetItem = (key, value) => {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.warn('localStorage access denied:', e)
    }
  }

  const safeRemoveItem = (key) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.warn('localStorage access denied:', e)
    }
  }

  /* 
  // REMOVED MOCK USERS
  const mockUsers = [ ... ] 
  */

  const API_BASE = import.meta.env.VITE_API_BASE || '';
  // If running via proxy in dev, empty string works (relative path). 
  // If no proxy set up yet, we might need full URL, but let's assume relative /api for now or handle in vite.config.

  useEffect(() => {
    // 检查本地存储中的用户信息
    const savedUser = safeGetItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('解析用户信息失败:', error)
        safeRemoveItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user)
        safeSetItem('user', JSON.stringify(data.user))
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error || '用户名或密码错误' }
      }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: '登录失败，请稍后重试' }
    }
  }

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();

      if (data.success && data.user) {
        setUser(data.user)
        safeSetItem('user', JSON.stringify(data.user))
        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error || '注册失败' }
      }
    } catch (error) {
      console.error('注册失败:', error)
      return { success: false, error: '注册失败，请稍后重试' }
    }
  }

  const logout = () => {
    setUser(null)
    safeRemoveItem('user')
  }

  const updateProfile = async (profileData) => {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      const updatedUser = { ...user, ...profileData }
      setUser(updatedUser)
      safeSetItem('user', JSON.stringify(updatedUser))
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('更新用户信息失败:', error)
      return { success: false, error: '更新失败，请稍后重试' }
    }
  }

  // 权限检查函数
  const hasPermission = (permission) => {
    if (!user) return false

    const permissions = {
      admin: ['read', 'write', 'delete', 'manage'],
      user: ['read', 'write']
    }

    const userPermissions = permissions[user.role] || []
    return userPermissions.includes(permission)
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isAuthenticated = () => {
    return !!user
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    hasPermission,
    isAdmin,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
