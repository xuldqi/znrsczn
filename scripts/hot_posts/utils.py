# -*- coding: utf-8 -*-
"""
Helper utilities for validating and cleaning injected community hot posts.
Strict 0 Emoji rule, schema conformance, and clean markdown.
"""
import re

EMOJI_REGEX = re.compile(
    r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\u2300-\u23ff]|[\u2b50]|[\u3030]|[\u200d]|[\u2190-\u21ff]'
)

def clean_emojis(text):
    if not isinstance(text, str):
        return text
    return EMOJI_REGEX.sub('', text)

def validate_and_clean_article(art):
    required_keys = ['id', 'title', 'excerpt', 'category', 'tags', 'source', 'sourceUrl', 'content']
    for k in required_keys:
        if k not in art:
            raise ValueError(f"Missing required key: {k} in article {art.get('id', 'unknown')}")
    
    art['title'] = clean_emojis(art['title'].strip())
    art['excerpt'] = clean_emojis(art['excerpt'].strip())
    art['category'] = clean_emojis(art['category'].strip())
    art['tags'] = [clean_emojis(t.strip()) for t in art['tags'] if clean_emojis(t.strip())]
    art['content'] = clean_emojis(art['content'].strip())
    
    # Defaults
    art['status'] = 'published'
    art['isExternal'] = False
    art['date'] = art.get('date', '2026-10-23')
    art['readTime'] = art.get('readTime', '10分钟精读')
    art['author'] = art.get('author', '特约撰稿')
    art['hotMetric'] = clean_emojis(art.get('hotMetric', '精选热帖'))
    
    # Verify no emojis remained
    for field in ['title', 'excerpt', 'category', 'content']:
        if EMOJI_REGEX.search(art[field]):
            raise ValueError(f"Emoji detected in field {field} for article {art['id']}")
    for t in art['tags']:
        if EMOJI_REGEX.search(t):
            raise ValueError(f"Emoji detected in tag {t} for article {art['id']}")
            
    return art
