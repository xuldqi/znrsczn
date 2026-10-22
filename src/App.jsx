import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { AuthProvider } from './contexts/AuthContext'
import { ArticleProvider } from './contexts/ArticleContext'
import { CategoryProvider } from './contexts/CategoryContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import LoadingFallback from './components/LoadingFallback'

import Home from './pages/Home'

// 路由代码分割（懒加载）
const TestPage = lazy(() => import('./pages/TestPage'))
const Articles = lazy(() => import('./pages/Articles'))
const Products = lazy(() => import('./pages/Products'))
const Psychology = lazy(() => import('./pages/Psychology'))
const Career = lazy(() => import('./pages/Career'))
const Family = lazy(() => import('./pages/Family'))
const Interests = lazy(() => import('./pages/Interests'))
const Finance = lazy(() => import('./pages/Finance'))
const LifeSkills = lazy(() => import('./pages/LifeSkills'))
const SideBusiness = lazy(() => import('./pages/SideBusiness'))
const MidlifeCrisis = lazy(() => import('./pages/MidlifeCrisis'))
const Transformation = lazy(() => import('./pages/Transformation'))
const Complaints = lazy(() => import('./pages/Complaints'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const Admin = lazy(() => import('./pages/Admin'))
const Login = lazy(() => import('./pages/Login'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const PensionPlanner = lazy(() => import('./pages/PensionPlanner'))
const Membership = lazy(() => import('./pages/Membership'))

import './App.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // 现代蓝色
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#7c3aed', // 紫色
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#f8fafc', // 更柔和的灰白色背景
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b', // 深灰色文字
      secondary: '#64748b', // 中灰色文字
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
            boxShadow: '0 8px 25px rgba(37, 99, 235, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.05)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CategoryProvider>
          <ArticleProvider>
            <Router>
              <ScrollToTop />
              <div className="App">
                <Navbar />
                <main>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/article/:slug" element={<ArticleDetail />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/psychology" element={<Psychology />} />
                      <Route path="/career" element={<Career />} />
                      <Route path="/family" element={<Family />} />
                      <Route path="/interests" element={<Interests />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/pension-planner" element={<PensionPlanner />} />
                      <Route path="/life-skills" element={<LifeSkills />} />
                      <Route path="/side-business" element={<SideBusiness />} />
                      <Route path="/midlife-crisis" element={<MidlifeCrisis />} />
                      <Route path="/transformation" element={<Transformation />} />
                      <Route path="/complaints" element={<Complaints />} />
                      <Route path="/membership" element={<Membership />} />
                      <Route path="/admin" element={
                        <ProtectedRoute requireAdmin={true}>
                          <Admin />
                        </ProtectedRoute>
                      } />
                      <Route path="/test" element={<TestPage />} />
                    </Routes>
                  </Suspense>
                </main>
              </div>
            </Router>
          </ArticleProvider>
        </CategoryProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
