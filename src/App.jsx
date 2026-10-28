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
const Dashboard = lazy(() => import('./pages/Dashboard'))
const TestPage = lazy(() => import('./pages/TestPage'))
const Articles = lazy(() => import('./pages/Articles'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
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
const LayoffCalculator = lazy(() => import('./pages/LayoffCalculator'))
const RetirementSalaryCalculator = lazy(() => import('./pages/RetirementSalaryCalculator'))
const SavingsPlanner = lazy(() => import('./pages/SavingsPlanner'))
const Membership = lazy(() => import('./pages/Membership'))
const MarketTemperature = lazy(() => import('./pages/MarketTemperature'))

import './App.css'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#c2410c', // 陶土暖棕（温暖、克制、书卷感）
      light: '#ea580c',
      dark: '#9a3412',
    },
    secondary: {
      main: '#44403c', // 石墨炭黑
      light: '#78716c',
      dark: '#1c1917',
    },
    background: {
      default: '#faf9f6', // 温暖柔和的护眼米纸底色
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1917', // 深石墨黑
      secondary: '#78716c', // 中灰色
    },
    grey: {
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
    },
    success: {
      main: '#059669',
      light: '#34d399',
      dark: '#047857',
    },
    warning: {
      main: '#d97706',
      light: '#fbbf24',
      dark: '#b45309',
    },
    error: {
      main: '#dc2626',
      light: '#f87171',
      dark: '#b91c1c',
    },
    info: {
      main: '#0284c7',
      light: '#38bdf8',
      dark: '#0369a1',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.25,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.4,
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
      lineHeight: 1.65,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          boxShadow: 'none',
          whiteSpace: 'nowrap',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#c2410c',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#9a3412',
            boxShadow: 'none',
          },
        },
        outlined: {
          borderColor: '#d6d3d1',
          color: '#44403c',
          '&:hover': {
            borderColor: '#a8a29e',
            backgroundColor: '#fafaf9',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid #e7e5e4',
          borderRadius: 10,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
            borderColor: '#d6d3d1',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: 10,
          border: '1px solid #e7e5e4',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(250, 249, 246, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e7e5e4',
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
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/article/:slug" element={<ArticleDetail />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:slug" element={<ProductDetail />} />
                      <Route path="/alternative/:slug" element={<ProductDetail />} />
                      <Route path="/psychology" element={<Psychology />} />
                      <Route path="/career" element={<Career />} />
                      <Route path="/family" element={<Family />} />
                      <Route path="/interests" element={<Interests />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/pension-planner" element={<PensionPlanner />} />
                      <Route path="/layoff-calculator" element={<LayoffCalculator />} />
                      <Route path="/retirement-calculator" element={<RetirementSalaryCalculator />} />
                      <Route path="/savings-planner" element={<SavingsPlanner />} />
                      <Route path="/market-temperature" element={<MarketTemperature />} />
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
