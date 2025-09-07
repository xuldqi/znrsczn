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

  // 模拟用户数据
  const mockUsers = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      email: 'admin@pm.com',
      role: 'admin',
      avatar: '/api/placeholder/40/40',
      name: '中年老王'
    },
    {
      id: 2,
      username: 'user',
      password: 'user123',
      email: 'user@pm.com',
      role: 'user',
      avatar: '/api/placeholder/40/40',
      name: '访客用户'
    }
  ]

  useEffect(() => {
    // 检查本地存储中的用户信息
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('解析用户信息失败:', error)
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundUser = mockUsers.find(
        u => u.username === username && u.password === password
      )
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        localStorage.setItem('user', JSON.stringify(userWithoutPassword))
        return { success: true, user: userWithoutPassword }
      } else {
        return { success: false, error: '用户名或密码错误' }
      }
    } catch (error) {
      return { success: false, error: '登录失败，请稍后重试' }
    }
  }

  const register = async (userData) => {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 检查用户名是否已存在
      const existingUser = mockUsers.find(u => u.username === userData.username)
      if (existingUser) {
        return { success: false, error: '用户名已存在' }
      }
      
      // 检查邮箱是否已存在
      const existingEmail = mockUsers.find(u => u.email === userData.email)
      if (existingEmail) {
        return { success: false, error: '邮箱已被注册' }
      }
      
      const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        role: 'user',
        avatar: '/api/placeholder/40/40',
        name: userData.name || userData.username
      }
      
      // 在实际应用中，这里会调用后端API
      mockUsers.push({ ...newUser, password: userData.password })
      
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))
      return { success: true, user: newUser }
    } catch (error) {
      return { success: false, error: '注册失败，请稍后重试' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const updateProfile = async (profileData) => {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const updatedUser = { ...user, ...profileData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return { success: true, user: updatedUser }
    } catch (error) {
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