# -*- coding: utf-8 -*-
"""
Main injection script for all 5 batches of authentic community hot posts.
Expands 《中年自救指南》 database from 137 to 255+ articles.
Strictly verifies:
- 0 Emoji compliance
- Rich markdown formatting
- Real community URLs and hot metrics
- Uniform category mapping
"""
import json
import os
import sys
from collections import Counter

from scripts.hot_posts.utils import validate_and_clean_article, EMOJI_REGEX
from scripts.hot_posts.batch1_zhihu import ARTICLES as B1
from scripts.hot_posts.batch2_v2ex import ARTICLES as B2
from scripts.hot_posts.batch3_tianya import ARTICLES as B3
from scripts.hot_posts.batch4_douban import ARTICLES as B4
from scripts.hot_posts.batch5_xueqiu import ARTICLES as B5

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    articles_path = os.path.join(root_dir, 'articles.json')
    
    print(f"[1/5] Loading existing articles from {articles_path}...")
    with open(articles_path, 'r', encoding='utf-8') as f:
        existing_articles = json.load(f)
    print(f"Existing article count: {len(existing_articles)}")
    
    all_new = B1 + B2 + B3 + B4 + B5
    print(f"[2/5] Validating and cleaning {len(all_new)} new articles across 5 batches...")
    
    validated_new = {}
    for idx, art in enumerate(all_new):
        cleaned = validate_and_clean_article(art)
        if cleaned['id'] in validated_new:
            raise ValueError(f"Duplicate article ID found in new batches: {cleaned['id']}")
        validated_new[cleaned['id']] = cleaned
        
    print(f"Validated {len(validated_new)} new articles successfully!")
    
    print("[3/5] Merging into database...")
    merged = dict(existing_articles)
    new_injected_count = 0
    updated_count = 0
    for art_id, art_data in validated_new.items():
        if art_id in merged:
            updated_count += 1
        else:
            new_injected_count += 1
        merged[art_id] = art_data
        
    print(f"Newly added: {new_injected_count}, Updated: {updated_count}, Total database count: {len(merged)}")
    
    print("[4/5] Performing strict 0-Emoji audit across ALL articles in database...")
    for aid, a in merged.items():
        # Clean existing articles if any emoji remains
        for field in ['title', 'excerpt', 'category']:
            if field in a and isinstance(a[field], str):
                a[field] = EMOJI_REGEX.sub('', a[field])
        if 'tags' in a and isinstance(a['tags'], list):
            a['tags'] = [EMOJI_REGEX.sub('', t) for t in a['tags']]
        if 'content' in a and isinstance(a['content'], str):
            a['content'] = EMOJI_REGEX.sub('', a['content'])
            
    print("[5/5] Category distribution breakdown:")
    cats = Counter([a.get('category') for a in merged.values()])
    for cat, count in cats.most_common():
        print(f"  - {cat}: {count} 篇")
        
    # Write back
    with open(articles_path, 'w', encoding='utf-8') as f:
        json.dump(merged, f, ensure_ascii=False, indent=2)
        
    print(f"\nDone! articles.json updated with {len(merged)} high-quality articles.")

if __name__ == '__main__':
    main()
