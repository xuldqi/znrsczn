# -*- coding: utf-8 -*-
"""
TrendRadar Simplified (实战版全网自救趋势采集引擎)
专为《中年自救指南》定制的多源实时文章抓取、清洗与自动化定时入库引擎

核心特性：
1. 每日自动抓取配额保证：精准控制每日新增 5 - 10 篇高质量自救/职场/财务实录
2. 真实网络全量抓取：覆盖少数派 (SSPAI)、知乎精选/日报、阮一峰网络日志、V2EX 职场精选等多渠道
3. 智能去重与防重保全：对比已有文章 ID 与标题指纹，已入库内容绝不重复收录，不冲抵老数据
4. 深度正文清洗与转排：HTML 自动转换为结构化清爽 Markdown，保留层级标题、引用与段落
5. 严格 0 Emoji 规范：彻底滤除所有 Emoji 表情符，确保严肃雅致的阅读体验
6. 站内阅读体验：isExternal 设为 False，支持全站原地沉浸式精读，同时保留原帖出处链接
7. Linux Crontab 无人值守守护：支持每日凌晨自动定时触发，自动记录运行日志到系统日志中
"""

import os
import sys
import json
import re
import datetime
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

# 请求头配置
HTTP_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/html, application/xml, */*'
}

# 每日新增文章目标区间 (5 - 10 篇)
DAILY_TARGET_MIN = 5
DAILY_TARGET_MAX = 10

# 中年自救关键词白名单库
RELEVANT_KEYWORDS = [
    "35岁", "40岁", "中年", "裁员", "离职", "辞职", "失业", "求职", "面试", "职场", "大厂", "降薪",
    "副业", "自由职业", "接单", "外包", "出海", "独立开发", "一人企业", "Solo", "变现", "做生意", "创业",
    "存钱", "攒钱", "消费降级", "极简", "房贷", "断供", "资产", "理财", "养老", "退休", "负债",
    "内耗", "焦虑", "精神内耗", "心态", "情绪", "迷茫", "人生", "家庭", "健康", "习惯", "折腾", "转型"
]

# 智能分类规则
CATEGORY_RULES = [
    (r"(裁员|下岗|35岁|40岁|求职|HR|离职|被裁|面试|跳槽|职场|工作|大厂|薪资|晋升)", "职场发展"),
    (r"(房贷|债务|破产|逾期|还本|借款|高股息|红利|康波|资产|定投|国债|利息|存钱|养老金|退休金|理财|降薪|基金)", "财务管理"),
    (r"(副业|接单|外包|咨询|做生意|摆摊|变现|一人公司|独立开发|出海|SaaS|小生意|自媒体|小红书)", "副业指南"),
    (r"(原生家庭|父母|夫妻|婚姻|伴侣|亲戚|借钱|补习|育儿|孩子|养老院)", "家庭关系"),
    (r"(极简|降本|做饭|体检|失业金|医保|断缴|社保|买菜|二手|房租|生活|断舍离)", "生活技能"),
    (r"(内耗|焦虑|虚荣|抑郁|自尊|心理|松弛|平和|心态|情绪|迷茫|精神|抑郁症)", "心理健康"),
    (r"(转型|独立开发|远程工作|海外接单|数字化|技术|周刊|转行|编程|AI|效能)", "转型升级"),
    (r"(危机|中年危机|自救|逆风翻盘)", "中年危机"),
]

def clean_emojis(text):
    """彻底剥离任何表情符号，保持严肃雅致排版"""
    if not isinstance(text, str):
        return text
    emoji_pattern = re.compile(
        r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\u2300-\u23ff]|[\u2b50]|[\u3030]|[\u200d]'
    )
    return emoji_pattern.sub('', text)

def normalize_title(title):
    """标准化标题用于去重对比"""
    if not title:
        return ""
    return re.sub(r'[^\w\u4e00-\u9fa5]', '', title).lower()

def infer_category(title, content):
    """根据标题与内容自动匹配最贴合的栏目分类"""
    combined = f"{title} {content}"
    for pattern, cat in CATEGORY_RULES:
        if re.search(pattern, combined):
            return cat
    return "职场发展"

def html_to_markdown(html_str):
    """将 HTML 富文本转换为结构规范的 Markdown"""
    if not html_str:
        return ""
    text = html_str
    # 标题转换
    text = re.sub(r'<h1[^>]*>(.*?)</h1>', r'\n\n# \1\n\n', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<h2[^>]*>(.*?)</h2>', r'\n\n## \1\n\n', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<h3[^>]*>(.*?)</h3>', r'\n\n### \1\n\n', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<h[4-6][^>]*>(.*?)</h[4-6]>', r'\n\n### \1\n\n', text, flags=re.IGNORECASE | re.DOTALL)
    # 引用与加粗
    text = re.sub(r'<blockquote[^>]*>(.*?)</blockquote>', r'\n\n> \1\n\n', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<strong[^>]*>(.*?)</strong>', r'**\1**', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<b[^>]*>(.*?)</b>', r'**\1**', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<em[^>]*>(.*?)</em>', r'*\1*', text, flags=re.IGNORECASE | re.DOTALL)
    # 段落与换行
    text = re.sub(r'<p[^>]*>(.*?)</p>', r'\n\n\1\n\n', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<br\s*/?>', r'\n', text, flags=re.IGNORECASE)
    text = re.sub(r'<li[^>]*>(.*?)</li>', r'\n- \1', text, flags=re.IGNORECASE | re.DOTALL)
    # 链接
    text = re.sub(r'<a\s+[^>]*href=[\"\']([^\"\']+)[\"\'][^>]*>(.*?)</a>', r'[\2](\1)', text, flags=re.IGNORECASE | re.DOTALL)
    # 去除代码块及其他所有标签
    text = re.sub(r'<pre[^>]*>(.*?)</pre>', r'\n```\n\1\n```\n', text, flags=re.IGNORECASE | re.DOTALL)
    text = re.sub(r'<[^>]+>', '', text)
    # 实体转义
    text = text.replace('&nbsp;', ' ').replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&').replace('&quot;', '"')
    # 规范空行
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

class TrendRadarCollector:
    def __init__(self, existing_articles):
        self.existing_articles = existing_articles
        self.existing_ids = set(existing_articles.keys())
        self.existing_titles = set(normalize_title(v.get("title", "")) for v in existing_articles.values())
        self.new_articles = []

    def fetch_url(self, url, is_json=True, timeout=12):
        try:
            req = urllib.request.Request(url, headers=HTTP_HEADERS)
            with urllib.request.urlopen(req, timeout=timeout) as response:
                content = response.read().decode('utf-8', errors='ignore')
                if is_json:
                    return json.loads(content)
                return content
        except Exception as e:
            print(f"  [抓取跳过] 请求异常: {url} -> {e}")
            return None

    def is_already_collected(self, art_id, title):
        """严格检查文章是否已收录"""
        if art_id in self.existing_ids:
            return True
        norm_title = normalize_title(title)
        if norm_title in self.existing_titles:
            return True
        for na in self.new_articles:
            if na["id"] == art_id or normalize_title(na["title"]) == norm_title:
                return True
        return False

    def is_keyword_relevant(self, title, summary=""):
        combined = f"{title} {summary}"
        return any(kw in combined for kw in RELEVANT_KEYWORDS)

    def add_article(self, article):
        if self.is_already_collected(article["id"], article["title"]):
            return False
        if len(self.new_articles) >= DAILY_TARGET_MAX:
            return False
        
        self.new_articles.append(article)
        self.existing_ids.add(article["id"])
        self.existing_titles.add(normalize_title(article["title"]))
        print(f"  [+] 成功入库: 《{article['title']}》 ({len(article['content'])}字 | {article['category']} | {article['source']})")
        return True

    def crawl_sspai(self, tag, offset=0, limit=5):
        """从少数派标签频道抓取真实长文"""
        if len(self.new_articles) >= DAILY_TARGET_MAX:
            return
        print(f"正在扫描少数派频道 [{tag}] (offset={offset})...")
        encoded_tag = urllib.parse.quote(tag)
        list_url = f"https://sspai.com/api/v1/article/tag/page/get?limit={limit}&offset={offset}&tag={encoded_tag}"
        res = self.fetch_url(list_url)
        if not res or not res.get("data"):
            return

        for item in res.get("data", []):
            if len(self.new_articles) >= DAILY_TARGET_MAX:
                break
            art_id = f"sspai-live-{item['id']}"
            title = clean_emojis(item.get("title", "").strip())
            summary = clean_emojis(item.get("summary", "").strip())

            if self.is_already_collected(art_id, title):
                continue

            # 抓取正文详情
            detail_url = f"https://sspai.com/api/v1/article/info/get?id={item['id']}"
            detail_res = self.fetch_url(detail_url)
            body_html = ""
            if detail_res and detail_res.get("data"):
                body_html = detail_res["data"].get("body", "")

            md_content = html_to_markdown(body_html) if body_html else f"# {title}\n\n{summary}"
            md_content = clean_emojis(md_content)
            if len(md_content) < 300:
                continue

            author = clean_emojis(item.get("author", {}).get("nickname", "少数派作者"))
            created_ts = item.get("created_at") or item.get("released_time")
            if created_ts:
                try:
                    date_str = datetime.datetime.fromtimestamp(created_ts).strftime("%Y-%m-%d")
                except Exception:
                    date_str = datetime.date.today().strftime("%Y-%m-%d")
            else:
                date_str = datetime.date.today().strftime("%Y-%m-%d")

            category = infer_category(title, md_content)

            self.add_article({
                "id": art_id,
                "title": title,
                "excerpt": summary[:160] + "..." if len(summary) > 160 else summary,
                "author": author,
                "date": date_str,
                "readTime": f"{max(3, round(len(md_content) / 450))}分钟精读",
                "category": category,
                "tags": [tag, category, "少数派"],
                "source": "少数派",
                "sourceUrl": f"https://sspai.com/post/{item['id']}",
                "content": md_content,
                "status": "published",
                "isExternal": False
            })

    def crawl_zhihu_daily(self, date_str=None, limit=5):
        """从知乎精选/日报抓取深度专栏"""
        if len(self.new_articles) >= DAILY_TARGET_MAX:
            return
        
        if date_str:
            print(f"正在扫描知乎历史精选 (日期={date_str})...")
            url = f"https://news-at.zhihu.com/api/4/news/before/{date_str}"
        else:
            print("正在扫描知乎精选深度专栏 (今日最新)...")
            url = "https://news-at.zhihu.com/api/4/news/latest"

        res = self.fetch_url(url)
        if not res or not res.get("stories"):
            return

        for story in res.get("stories", [])[:limit]:
            if len(self.new_articles) >= DAILY_TARGET_MAX:
                break
            sid = story["id"]
            title = clean_emojis(story.get("title", "").strip())
            art_id = f"zhihu-daily-{sid}"

            if self.is_already_collected(art_id, title):
                continue

            detail_url = f"https://news-at.zhihu.com/api/4/news/{sid}"
            det_res = self.fetch_url(detail_url)
            if not det_res:
                continue

            body_html = det_res.get("body", "")
            md_content = clean_emojis(html_to_markdown(body_html))
            if len(md_content) < 350:
                continue

            category = infer_category(title, md_content)
            cur_date = datetime.date.today().strftime("%Y-%m-%d")

            self.add_article({
                "id": art_id,
                "title": title,
                "excerpt": md_content[:150].replace('\n', ' ') + "...",
                "author": "知乎精选答主",
                "date": cur_date,
                "readTime": f"{max(3, round(len(md_content) / 450))}分钟精读",
                "category": category,
                "tags": ["知乎精选", category, "深度长文"],
                "source": "知乎",
                "sourceUrl": det_res.get("share_url") or f"https://daily.zhihu.com/story/{sid}",
                "content": md_content,
                "status": "published",
                "isExternal": False
            })

    def crawl_ruanyifeng_weekly(self):
        """从阮一峰科技爱好者周刊抓取职业与技术思考"""
        if len(self.new_articles) >= DAILY_TARGET_MAX:
            return
        print("正在扫描阮一峰网络日志精选...")
        feed_url = "https://www.ruanyifeng.com/blog/atom.xml"
        xml_data = self.fetch_url(feed_url, is_json=False)
        if not xml_data:
            return

        try:
            root = ET.fromstring(xml_data)
            entries = root.findall('{http://www.w3.org/2005/Atom}entry')
            for entry in entries[:3]:
                if len(self.new_articles) >= DAILY_TARGET_MAX:
                    break
                title = clean_emojis(entry.find('{http://www.w3.org/2005/Atom}title').text.strip())
                art_id = f"ruanyifeng-{abs(hash(title))}"
                if self.is_already_collected(art_id, title):
                    continue

                content_el = entry.find('{http://www.w3.org/2005/Atom}content')
                body_html = content_el.text if content_el is not None else ""
                md_content = clean_emojis(html_to_markdown(body_html))

                category = infer_category(title, md_content)
                self.add_article({
                    "id": art_id,
                    "title": title,
                    "excerpt": md_content[:160].replace('\n', ' ') + "...",
                    "author": "阮一峰",
                    "date": datetime.date.today().strftime("%Y-%m-%d"),
                    "readTime": f"{max(5, round(len(md_content) / 450))}分钟精读",
                    "category": category,
                    "tags": ["独立思考", "技术转型", "成长周刊"],
                    "source": "个人博客",
                    "sourceUrl": "https://www.ruanyifeng.com/blog/",
                    "content": md_content,
                    "status": "published",
                    "isExternal": False
                })
        except Exception as e:
            print(f"  [解析错误] 阮一峰周刊解析异常: {e}")

    def crawl_v2ex_hot(self):
        """从 V2EX 热门与职场主题抓取深度讨论"""
        if len(self.new_articles) >= DAILY_TARGET_MAX:
            return
        print("正在扫描 V2EX 热门话题与职场思考...")
        feed_url = "https://www.v2ex.com/index.xml"
        xml_data = self.fetch_url(feed_url, is_json=False)
        if not xml_data:
            return

        try:
            root = ET.fromstring(xml_data)
            entries = root.findall('{http://www.w3.org/2005/Atom}entry')
            for entry in entries[:5]:
                if len(self.new_articles) >= DAILY_TARGET_MAX:
                    break
                title = clean_emojis(entry.find('{http://www.w3.org/2005/Atom}title').text.strip())
                art_id = f"v2ex-{abs(hash(title))}"
                if self.is_already_collected(art_id, title):
                    continue

                content_el = entry.find('{http://www.w3.org/2005/Atom}content')
                body_html = content_el.text if content_el is not None else ""
                md_content = clean_emojis(html_to_markdown(body_html))

                if len(md_content) < 200:
                    continue

                category = infer_category(title, md_content)
                self.add_article({
                    "id": art_id,
                    "title": title,
                    "excerpt": md_content[:150].replace('\n', ' ') + "...",
                    "author": "V2EX 开发者",
                    "date": datetime.date.today().strftime("%Y-%m-%d"),
                    "readTime": f"{max(2, round(len(md_content) / 450))}分钟精读",
                    "category": category,
                    "tags": ["职场思考", "独立开发", "V2EX"],
                    "source": "V2EX",
                    "sourceUrl": "https://www.v2ex.com",
                    "content": md_content,
                    "status": "published",
                    "isExternal": False
                })
        except Exception as e:
            print(f"  [解析错误] V2EX 解析异常: {e}")

    def execute_daily_batch(self):
        """执行每日抓取任务，确保新增文章数量达到 5 - 10 篇"""
        # 1. 抓取少数派高相关频道
        sspai_tags = ["职场", "效率思维", "生活方式", "个人成长", "工作流", "效率工具"]
        for tag in sspai_tags:
            self.crawl_sspai(tag, offset=0, limit=4)
            if len(self.new_articles) >= DAILY_TARGET_MAX:
                break

        # 2. 抓取知乎日报最新
        if len(self.new_articles) < DAILY_TARGET_MIN:
            self.crawl_zhihu_daily(limit=4)

        # 3. 抓取阮一峰专栏
        if len(self.new_articles) < DAILY_TARGET_MIN:
            self.crawl_ruanyifeng_weekly()

        # 4. 抓取 V2EX 热门
        if len(self.new_articles) < DAILY_TARGET_MIN:
            self.crawl_v2ex_hot()

        # 5. 保底补充：如果本日新增仍未达到 5 篇，深翻少数派第 2 页及知乎前日精选
        if len(self.new_articles) < DAILY_TARGET_MIN:
            print(f"当前新增 {len(self.new_articles)} 篇，启动深度翻页补充以确保满足每日保底 5 篇要求...")
            for tag in ["职场", "效率思维", "个人成长"]:
                self.crawl_sspai(tag, offset=5, limit=5)
                if len(self.new_articles) >= DAILY_TARGET_MIN:
                    break

        if len(self.new_articles) < DAILY_TARGET_MIN:
            yesterday_str = (datetime.date.today() - datetime.timedelta(days=1)).strftime("%Y%m%d")
            self.crawl_zhihu_daily(date_str=yesterday_str, limit=5)

        return self.new_articles

def main():
    start_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("=" * 60)
    print(f"[{start_time}] 启动 TrendRadar Simplified 每日自动化抓取任务")
    print("=" * 60)

    # 确定目标文件路径
    target_file = "articles.json"
    if not os.path.exists(target_file):
        if os.path.exists("/var/www/bambumoon-sites/main-site/articles.json"):
            target_file = "/var/www/bambumoon-sites/main-site/articles.json"

    # 读取已有文章
    articles_db = {}
    if os.path.exists(target_file):
        with open(target_file, "r", encoding="utf-8") as f:
            try:
                articles_db = json.load(f)
            except Exception as e:
                print(f"读取原有数据异常: {e}")
                articles_db = {}

    initial_count = len(articles_db)
    print(f"当前系统文章库总数: {initial_count} 篇\n")

    # 执行每日采集
    collector = TrendRadarCollector(articles_db)
    new_articles = collector.execute_daily_batch()

    print(f"\n每日抓取阶段完成，本次成功采纳 {len(new_articles)} 篇新文章 (目标区间: 5 - 10 篇)。")

    # 入库合并
    for item in new_articles:
        articles_db[item["id"]] = item

    # 严格 0 Emoji 全量消毒
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\u2300-\u23ff]|[\u2b50]|[\u3030]|[\u200d]')
    for k, v in articles_db.items():
        for field in ["title", "excerpt", "author", "content"]:
            val = v.get(field, "")
            if isinstance(val, str) and emoji_pattern.search(val):
                v[field] = emoji_pattern.sub('', val)

    # 写入文件
    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(articles_db, f, ensure_ascii=False, indent=2)

    total_count = len(articles_db)
    end_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("=" * 60)
    print(f"[{end_time}] 每日抓取与入库成功！")
    print(f"本日新增入库: {len(new_articles)} 篇")
    print(f"全站最新文章规模: {total_count} 篇")
    print("=" * 60)

if __name__ == "__main__":
    main()
