# -*- coding: utf-8 -*-
"""
TrendRadar Simplified (实战版《35+指南》垂直内容采集引擎)
专为《35+指南》定制的高门槛、强过滤、防杂质文章抓取入库引擎

核心筛选标准（铁律）：
1. 针对 35+ 人群核心痛点：职场突围、大龄求职、劳动维权、一人公司、独立开发、出海搞钱、记账存钱、资产配置、防断供与身心健康；
2. 标题一票否决黑名单：古城文物、天体科幻、电影剧集、娱乐八卦、旅游打卡、数码开箱、整容医美；
3. 正文字数 >= 500 字，白名单关键词加权打分 >= 40 分；
4. 宁缺毋滥，每批采集 5-8 篇高价值实操文章，全站保持 0 Emoji 标准。
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

# 每日抓取上限
DAILY_TARGET_MAX = 6

# 四大核心自救板块关键词白名单
PILLAR_KEYWORDS = {
    "职场与维权": [
        "裁员", "被裁", "离职", "辞职", "失业", "待业", "求职", "面试", "降薪",
        "35岁", "40岁", "职场", "劳动仲裁", "经济补偿", "赔偿", "n+1", "2n",
        "pip", "调岗", "考公", "考编", "大厂", "中层", "中年危机", "找工作", "合同法", "sop"
    ],
    "房贷与钱袋子": [
        "房贷", "断供", "延期还本", "协商还款", "法拍", "消费降级", "极简", "攒钱",
        "存钱", "记账", "资产配置", "高股息", "红利", "定投", "理财", "负债",
        "养老金", "退休金", "退休", "社保", "医保", "断缴", "灵活就业", "失业金", "开销", "资产"
    ],
    "副业与搞钱": [
        "一人企业", "一人公司", "独立开发", "solo builder", "indie hacker", "出海",
        "自由职业", "远程工作", "接单", "外包", "副业", "搞钱", "变现", "小生意",
        "自媒体", "数字游民", "做生意", "商业化"
    ],
    "生活与心态": [
        "内耗", "精神内耗", "焦虑", "迷茫", "抑郁", "心态", "松弛", "情绪稳定",
        "体检", "脂肪肝", "尿酸", "逆转", "健康", "家庭", "伴侣", "习惯"
    ]
}

# 扁平化所有核心关键词
ALL_WHITELIST_KEYWORDS = []
for kws in PILLAR_KEYWORDS.values():
    ALL_WHITELIST_KEYWORDS.extend(kws)
ALL_WHITELIST_KEYWORDS = list(set(ALL_WHITELIST_KEYWORDS))

# 标题一票否决黑名单
TITLE_BLACKLIST = [
    "丝绸之路", "古城", "遗址", "文物", "考古", "朝代", "五代十国", "唐朝", "宋朝", "明朝",
    "清朝", "战国", "秦始皇", "博物馆", "兵马俑", "墓葬", "青铜器",
    "外星", "星球", "宇宙", "天体", "黑洞", "科幻", "恒星", "光年",
    "电影", "电视剧", "剧集", "观影", "本周看什么", "影评", "动漫", "番剧", "明星", "八卦",
    "综艺", "演唱会", "追星",
    "旅游", "游记", "景点", "关西", "东京", "酒店", "门票", "自由行", "民宿",
    "机械键盘", "轴体", "手机壳", "相机镜头", "摄影镜头", "单反", "微单", "开箱",
    "吐槽", "段子", "瞎扯", "搞笑", "脑筋急转弯",
    "尸皮针", "医美", "整容", "双眼皮", "化妆", "穿搭"
]

# 正文一票否决恶性垃圾黑名单
BODY_BLACKLIST = [
    "尸皮针", "整容医院", "八卦爆料", "番剧更新", "键盘轴体", "单反镜头", "青铜器出土", "本周看什么"
]

CATEGORY_RULES = [
    (r"(裁员|下岗|35岁|40岁|求职|HR|离职|被裁|面试|跳槽|职场|工作|大厂|薪资|晋升|pip|劳动仲裁|2n|n\+1)", "职场发展"),
    (r"(房贷|债务|破产|逾期|还本|借款|高股息|红利|康波|资产|定投|国债|利息|存钱|养老金|退休金|理财|降薪|基金|记账)", "财务管理"),
    (r"(副业|接单|外包|咨询|做生意|摆摊|变现|一人公司|独立开发|出海|saas|小生意|自媒体|solo builder|自由职业)", "副业指南"),
    (r"(原生家庭|父母|夫妻|婚姻|伴侣|亲戚|借钱|补习|育儿|孩子|养老院)", "家庭关系"),
    (r"(极简|降本|做饭|体检|失业金|医保|断缴|社保|买菜|二手|房租|生活|断舍离)", "生活技能"),
    (r"(内耗|焦虑|虚荣|抑郁|自尊|心理|松弛|平和|心态|情绪|迷茫|精神)", "心理健康"),
    (r"(转型|独立开发|远程工作|海外接单|数字化|技术|周刊|转行|编程|ai|效能)", "转型升级"),
    (r"(危机|中年危机|自救|逆风翻盘)", "中年危机"),
]

def clean_emojis(text):
    """彻底剥离任何表情符号"""
    if not isinstance(text, str):
        return text
    emoji_pattern = re.compile(
        r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\u2300-\u23ff]|[\u2b50]|[\u3030]|[\u200d]'
    )
    return emoji_pattern.sub('', text)

def normalize_title(title):
    if not title:
        return ""
    return re.sub(r'[^\w\u4e00-\u9fa5]', '', title).lower()

def infer_category(title, content):
    combined = f"{title} {content}".lower()
    for pattern, cat in CATEGORY_RULES:
        if re.search(pattern, combined):
            return cat
    return "职场发展"

def html_to_markdown(html_str):
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
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def evaluate_relevance(title, summary, content):
    """
    加权评估一篇文章是否真正符合《35+指南》收录标准
    返回: (passed: bool, reason: str, score: int)
    """
    full_text = f"{title} {summary} {content}".lower()
    lower_title = title.lower()

    # 1. 标题一票否决黑名单
    for bl in TITLE_BLACKLIST:
        if bl in lower_title:
            return False, f"标题命中禁止黑名单词汇: [{bl}]", -200

    # 2. 正文恶性垃圾词一票否决
    for bl in BODY_BLACKLIST:
        if bl in full_text:
            return False, f"正文命中恶性垃圾词汇: [{bl}]", -200

    # 3. 影视娱乐或文博历史密度过大淘汰
    if full_text.count("电影") >= 8 or full_text.count("电视剧") >= 5 or full_text.count("古城") >= 4:
        return False, "正文偏向娱乐影视或历史文博，非实操文章", -100

    # 4. 正文字数门槛检验（必须是深度有信息量的实战长文）
    clean_len = len(re.sub(r'\s+', '', content))
    if clean_len < 450:
        return False, f"正文字数过少 ({clean_len}字 < 450字门槛)，非深度文章", 0

    # 5. 白名单命中评分计算
    score = 0
    title_hits = [kw for kw in ALL_WHITELIST_KEYWORDS if kw in lower_title]
    if title_hits:
        score += 50

    body_hit_count = sum(full_text.count(kw) for kw in ALL_WHITELIST_KEYWORDS)
    if body_hit_count >= 5:
        score += 40
    elif body_hit_count >= 2:
        score += 25
    elif body_hit_count >= 1:
        score += 15

    # 6. 判定达到 40 分，且标题或正文有核心痛点覆盖
    if score >= 40 and (len(title_hits) > 0 or body_hit_count >= 3):
        return True, f"符合标准 (得分: {score}分 | 标题命中: {title_hits} | 全文关键词密度: {body_hit_count})", score

    return False, f"相关度不足 (得分: {score}分 < 40分门槛 | 关键词命中过低)", score

class StrictTrendCollector:
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
            print(f"  [抓取跳过] 网络请求异常: {url} -> {e}")
            return None

    def is_already_collected(self, art_id, title):
        if art_id in self.existing_ids:
            return True
        norm_title = normalize_title(title)
        if norm_title in self.existing_titles:
            return True
        for na in self.new_articles:
            if na["id"] == art_id or normalize_title(na["title"]) == norm_title:
                return True
        return False

    def try_admit_article(self, article, raw_summary=""):
        """严格审核把关文章，只有合格才入库"""
        if self.is_already_collected(article["id"], article["title"]):
            return False
        if len(self.new_articles) >= DAILY_TARGET_MAX:
            return False

        passed, reason, score = evaluate_relevance(article["title"], raw_summary, article["content"])
        if not passed:
            print(f"  [✕ 拦截淘汰] 《{article['title']}》 -> {reason}")
            return False

        self.new_articles.append(article)
        self.existing_ids.add(article["id"])
        self.existing_titles.add(normalize_title(article["title"]))
        print(f"  [✓ 成功入库] 《{article['title']}》 ({len(article['content'])}字 | {article['category']} | 得分: {score})")
        return True

    def crawl_sspai_channel(self, tag, limit=6):
        """精准采集少数派优质专栏"""
        if len(self.new_articles) >= DAILY_TARGET_MAX:
            return
        print(f"扫描少数派垂直专栏 [{tag}]...")
        encoded_tag = urllib.parse.quote(tag)
        list_url = f"https://sspai.com/api/v1/article/tag/page/get?limit={limit}&offset=0&tag={encoded_tag}"
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

            self.try_admit_article({
                "id": art_id,
                "title": title,
                "excerpt": summary[:160] + "..." if len(summary) > 160 else summary,
                "author": author,
                "date": date_str,
                "readTime": f"{max(3, round(len(md_content) / 450))}分钟精读",
                "category": category,
                "tags": [tag, category, "深度实操"],
                "source": "少数派",
                "sourceUrl": f"https://sspai.com/post/{item['id']}",
                "content": md_content,
                "status": "published",
                "isExternal": False
            }, raw_summary=summary)

    def crawl_ruanyifeng_weekly(self):
        """精准采集阮一峰周刊思考与职业探讨"""
        if len(self.new_articles) >= DAILY_TARGET_MAX:
            return
        print("扫描阮一峰网络周刊思考...")
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
                self.try_admit_article({
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
                }, raw_summary=md_content[:150])
        except Exception as e:
            print(f"  [解析异常] 阮一峰周刊解析错误: {e}")

    def execute_collection(self):
        # 1. 少数派垂直高权重专栏 (理财、记账、职场、工作、效率思维、生活、健康)
        channels = ["理财", "记账", "职场", "工作", "效率思维", "生活", "健康"]
        for ch in channels:
            if len(self.new_articles) >= DAILY_TARGET_MAX:
                break
            self.crawl_sspai_channel(ch, limit=6)

        # 2. 阮一峰周刊深度观点
        if len(self.new_articles) < DAILY_TARGET_MAX:
            self.crawl_ruanyifeng_weekly()

        return self.new_articles

def main():
    start_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("=" * 65)
    print(f"[{start_time}] 启动 TrendRadar Simplified 严格高门槛自救文章采集团")
    print("=" * 65)

    target_file = "articles.json"
    if not os.path.exists(target_file):
        if os.path.exists("/var/www/bambumoon-sites/main-site/articles.json"):
            target_file = "/var/www/bambumoon-sites/main-site/articles.json"

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

    # 执行严格筛选采集
    collector = StrictTrendCollector(articles_db)
    new_articles = collector.execute_collection()

    print(f"\n审核过滤阶段完成，本次严格采纳通过: {len(new_articles)} 篇高质量自救文章。")

    if new_articles:
        for item in new_articles:
            articles_db[item["id"]] = item

        # 严格 0 Emoji 全量过滤
        emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\u2300-\u23ff]|[\u2b50]|[\u3030]|[\u200d]')
        for k, v in articles_db.items():
            for field in ["title", "excerpt", "author", "content"]:
                val = v.get(field, "")
                if isinstance(val, str) and emoji_pattern.search(val):
                    v[field] = emoji_pattern.sub('', val)

        with open(target_file, "w", encoding="utf-8") as f:
            json.dump(articles_db, f, ensure_ascii=False, indent=2)

    total_count = len(articles_db)
    end_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("=" * 65)
    print(f"[{end_time}] 任务执行完毕！")
    print(f"本日合格入库: {len(new_articles)} 篇 (宁缺毋滥，拒绝垃圾内容)")
    print(f"全站有效文章规模: {total_count} 篇")
    print("=" * 65)

if __name__ == "__main__":
    main()
