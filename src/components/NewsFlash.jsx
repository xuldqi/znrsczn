import { useEffect, useState } from 'react'
import { Box, Typography, Chip, Stack, Paper, Link as MuiLink, CircularProgress, Button } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import { DEFAULT_NEWS_SOURCES, DEFAULT_KEYWORDS } from '../config/newsSources'

const fetchRSS = async (url) => {
  const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
  const data = await res.json()
  const text = data.contents
  const parser = new DOMParser()
  const xml = parser.parseFromString(text, 'application/xml')
  const items = Array.from(xml.querySelectorAll('item')).map((item) => ({
    title: item.querySelector('title')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
    pubDate: item.querySelector('pubDate')?.textContent || '',
    source: url
  }))
  return items
}

const matchesKeywords = (text, keywords) => {
  return keywords.some((kw) => text.includes(kw))
}

export default function NewsFlash({ sources = DEFAULT_NEWS_SOURCES, keywords = DEFAULT_KEYWORDS, limit = 12 }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const lists = await Promise.allSettled(sources.map((s) => fetchRSS(s.url)))
        const merged = lists
          .filter((r) => r.status === 'fulfilled')
          .flatMap((r) => r.value)
          .filter((i) => matchesKeywords(`${i.title}`, keywords))
          .map((i) => ({ ...i, ts: Date.parse(i.pubDate) || 0 }))
          .sort((a, b) => b.ts - a.ts)
          .slice(0, limit)
        if (!cancelled) setItems(merged)
      } catch (e) {
        if (!cancelled) setItems([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [sources, keywords, limit])

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 3 }}>
        <CircularProgress size={20} />
      </Stack>
    )
  }

  if (!items.length) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        暂无相关新闻，可稍后再试或调整关键词。
      </Typography>
    )
  }

  return (
    <Stack spacing={1.5}>
      {items.map((item, idx) => (
        <Paper key={idx} variant="outlined" sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip size="small" label={new Date(item.ts).toLocaleString()} sx={{ mr: 1 }} />
          <MuiLink href={item.link} target="_blank" rel="noreferrer" underline="hover" sx={{ flex: 1 }}>
            {item.title}
          </MuiLink>
          <Button size="small" endIcon={<ArrowForward />} component={MuiLink} href={item.link} target="_blank" rel="noreferrer">
            查看
          </Button>
        </Paper>
      ))}
    </Stack>
  )
}
