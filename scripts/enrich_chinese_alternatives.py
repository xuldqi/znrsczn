import json
import re

def strip_emojis(text):
    if not text:
        return text
    emoji_pattern = re.compile(
        r"[\U00010000-\U0010ffff\u2600-\u27bf\u2300-\u23ff\u2b50\u200d\ufe0f\u2700-\u27bf\u25a0-\u25ff\u2b00-\u2bff]"
    )
    return emoji_pattern.sub("", text).strip()

data_path = "/Users/macmima1234/Documents/website/pmsaveself/src/data/alternativesData.json"
data = json.load(open(data_path, encoding="utf-8"))

targets = data["targets"]
alternatives = data["alternatives"]
categories = data["categories"]

chinese_slugs = {
    "wps", "capcut-pro", "xmind", "youdao-note", "tencent-docs",
    "dingtalk", "feishu", "baidu-pan", "xunlei", "115-pan",
    "aliyun-pan", "360-browser", "netease-music", "sunlogin-todesk",
    "china-pdf-tools", "china-screen-mirror", "wechat-backup-tools",
    "china-reader-apps", "china-zip-tools"
}

# Update existing targets
for t in targets:
    if t["slug"] in chinese_slugs or "会员" in t["name"] or "国产" in (t.get("description") or ""):
        t["is_chinese"] = True
    else:
        t["is_chinese"] = False

# New targets to add
new_targets = [
    {
        "id": 59,
        "name": "向日葵 / ToDesk 远程控制",
        "slug": "sunlogin-todesk",
        "category_id": 5,
        "logo_url": None,
        "description": "国内主流远程桌面与控制软件，免费版限速30帧且限制多设备，付费版每年上百元。",
        "official_url": "https://sunlogin.oray.com/",
        "price_info": "¥158/年起或限速限设备",
        "sort_order": 1,
        "is_chinese": True
    },
    {
        "id": 60,
        "name": "国产流氓/付费 PDF 转换器",
        "slug": "china-pdf-tools",
        "category_id": 8,
        "logo_url": None,
        "description": "国产常见PDF转换软件，常见套路为转换前声称免费，转完导出时强制按页收取高额费用。",
        "official_url": "",
        "price_info": "¥68-198/年或按页扣费",
        "sort_order": 2,
        "is_chinese": True
    },
    {
        "id": 61,
        "name": "各类国产投屏收费软件 (傲软投屏/幕连)",
        "slug": "china-screen-mirror",
        "category_id": 4,
        "logo_url": None,
        "description": "手机投屏到电脑的商业软件，免费版限制时长10分钟、强制水印且画质压缩模糊。",
        "official_url": "",
        "price_info": "¥128/年或按分钟限时",
        "sort_order": 3,
        "is_chinese": True
    },
    {
        "id": 62,
        "name": "微信聊天记录备份/手机助手收费软件",
        "slug": "wechat-backup-tools",
        "category_id": 4,
        "logo_url": None,
        "description": "商业手机备份与微信数据恢复工具，利用微信存储爆满痛点收取数百元买断费用。",
        "official_url": "",
        "price_info": "¥199/终身买断",
        "sort_order": 4,
        "is_chinese": True
    },
    {
        "id": 63,
        "name": "微信读书 / 收费网络小说平台",
        "slug": "china-reader-apps",
        "category_id": 2,
        "logo_url": None,
        "description": "主流网文与电子书平台，强制开通付费卡、插播连环广告且部分热门书籍反复加价。",
        "official_url": "",
        "price_info": "¥19-40/月付费卡",
        "sort_order": 5,
        "is_chinese": True
    },
    {
        "id": 64,
        "name": "国产流氓解压软件 (快压/好压/360压缩国内版)",
        "slug": "china-zip-tools",
        "category_id": 4,
        "logo_url": None,
        "description": "捆绑全家桶弹窗、右下角低俗网页弹窗广告的流氓压缩工具。",
        "official_url": "",
        "price_info": "免费但强制流氓弹窗广告",
        "sort_order": 6,
        "is_chinese": True
    }
]

existing_target_slugs = {t["slug"]: t for t in targets}
for nt in new_targets:
    if nt["slug"] not in existing_target_slugs:
        targets.append(nt)
        existing_target_slugs[nt["slug"]] = nt

target_map = {t["slug"]: t for t in targets}

# New high quality Chinese alternatives to add
new_alts = [
    {
        "id": 133,
        "name": "必剪",
        "slug": "bicut",
        "free_tier": 1,
        "free_tier_detail": "B站官方出品，所有特效花字贴纸与智能语音转字幕完全免费，无水印，支持 4K 60fps 导出",
        "tags": ["国产良心", "B站出品", "自动生成字幕", "无水印", "自媒体必备"],
        "platforms": ["Windows", "macOS", "iOS", "Android"],
        "pricing_truth": {
            "core": {"status": "free", "note": "多轨道剪辑、画中画、变速等核心剪辑功能全部免费"},
            "ai": {"status": "free", "note": "智能语音一键识别生成字幕、AI 抠像、朗读配音完全免费"},
            "export": {"status": "free", "note": "最高支持 4K 60fps 高清导出，无任何强制水印"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "0元替代剪映专业版全套VIP功能",
            "steps": [
                "下载安装必剪电脑端或手机端（直接在官网或应用商店获取）",
                "使用普通 B 站账号登录（不需要开通大会员）",
                "导入视频素材，使用「文本 -> 语音识别」自动生成卡点字幕",
                "自由使用全部分类下的热门贴纸与花字，导出时勾选 4K 60fps 原画画质"
            ],
            "difficulty": "low"
        },
        "official_url": "https://bcut.bilibili.com/",
        "github_url": None,
        "github_stars": 0,
        "description": "B站官方专为视频创作者打造的无广告全能剪辑软件。拥有完全不输剪映的特效、海量贴纸与高精度智能语音转字幕功能，终身零元无套路。",
        "pros": ["智能语音转字幕极度准确，大幅节省打字时间", "无强制 VIP 机制，特效花字全部免收割", "导出画质纯净无水印"],
        "cons": ["偏向中短视频与自媒体，好莱坞级复杂调色不如达芬奇"],
        "target_slug": "capcut-pro",
        "is_chinese": True
    },
    {
        "id": 134,
        "name": "知犀思维导图",
        "slug": "zhixi-mind",
        "free_tier": 3,
        "free_tier_detail": "个人基础版不限节点数量，无水印高清导出 PDF 与超清图片，云端实时自动保存",
        "tags": ["国产良心", "0节点限制", "导出无水印", "思维导图", "全平台同步"],
        "platforms": ["Windows", "macOS", "Web", "iOS", "Android"],
        "pricing_truth": {
            "core": {"status": "free", "note": "思维导图、逻辑图、组织结构图绘制完全免费，不限制节点总数"},
            "sync": {"status": "free", "note": "个人多设备云端自动实时同步存储"},
            "export": {"status": "free", "note": "免费导出高清 PNG、PDF，绝无 XMind 免费版的巨幅居中水印"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "零元绘制大型思维导图并高清无水印导出",
            "steps": [
                "访问知犀思维导图网页版或客户端注册个人账号",
                "新建导图，支持自由添加上百个子节点（无任何收费弹窗卡顿）",
                "点击右上角「导出」，选择 PDF 或 PNG 格式，直接下载高清净版文件"
            ],
            "difficulty": "low"
        },
        "official_url": "https://www.zhixi.com/",
        "github_url": None,
        "github_stars": 0,
        "description": "打破 XMind 与幕布收费限制的国产良心思维导图工具。个人使用不限节点数量、导出完全无水印，真正做到零门槛开箱即用。",
        "pros": ["不限制节点数量，支持绘制千节点超大知识脑图", "导出 PDF/图片无水印，可直接用于汇报展示", "全平台云端同步无缝漫游"],
        "cons": ["超大附件文件嵌入或企业团队多人实时协作需要团队权限"],
        "target_slug": "xmind",
        "is_chinese": True
    },
    {
        "id": 135,
        "name": "思源笔记 (SiYuan)",
        "slug": "siyuan-note",
        "free_tier": 1,
        "free_tier_detail": "核心客户端完全开源，本地离线使用 100% 免费无限制，无登录设备数量限制，支持自建云同步",
        "tags": ["开源神器", "国产自研", "本地优先", "块级双链", "支持Docker"],
        "platforms": ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
        "pricing_truth": {
            "core": {"status": "free", "note": "块级大纲双链笔记、思维导图互转、PDF 标注全部本地免费"},
            "sync": {"status": "self_host", "note": "可零元使用 WebDAV、S3、自建 Docker 服务端或移动硬盘同步"},
            "export": {"status": "free", "note": "支持导出 Markdown、PDF、Word 与完整知识库离线包"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "零元搭建私有多端同步知识库",
            "steps": [
                "安装思源笔记客户端（支持 Windows / Mac / 手机）",
                "在「设置 -> 同步」中选择 WebDAV 模式",
                "填入阿里云盘或自建 WebDAV 服务器连接信息",
                "实现电脑与手机端零成本、无限容量的端到端加密同步"
            ],
            "difficulty": "medium"
        },
        "official_url": "https://b3log.org/siyuan/",
        "github_url": "https://github.com/siyuan-note/siyuan",
        "github_stars": 19000,
        "description": "国产开源本地优先的个人知识管理系统。支持块级双链、大纲笔记与闪卡复习，彻底摆脱有道云笔记设备登录上限与开屏广告骚扰。",
        "pros": ["数据完全保存在本地磁盘，隐私绝对安全，无需担心被封号", "无任何设备数量限制，支持局域网直接同步", "块级引用细粒度行业顶级"],
        "cons": ["官方云端一键托管服务需要订阅（但自建 WebDAV 零元可用）"],
        "target_slug": "youdao-note",
        "is_chinese": True
    },
    {
        "id": 136,
        "name": "RustDesk",
        "slug": "rustdesk",
        "free_tier": 1,
        "free_tier_detail": "开源跨平台远程桌面，官方公共中继完全免费，支持自建私有服务器实现 0 元满速",
        "tags": ["开源神作", "76kStars", "远程控制", "自建服务器", "低延迟"],
        "platforms": ["Windows", "macOS", "Linux", "iOS", "Android", "Web"],
        "pricing_truth": {
            "core": {"status": "free", "note": "远程桌面控制、文件传输、双向剪贴板完全免费无限制"},
            "sync": {"status": "free", "note": "无设备数量绑定限制，点对点 P2P 直连无需中转费用"},
            "ai": {"status": "self_host", "note": "可自建轻量服务器中继，彻底摆脱公共高峰期排队"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "3分钟自建专属 60 帧满速远程桌面",
            "steps": [
                "在被控端和主控端分别安装 RustDesk 客户端",
                "日常直接输入 ID 与密码即可通过公共服务器一键远程连接",
                "若需追求极致低延迟，可在个人 99 元/年轻量服务器运行官方一键 Docker 命令",
                "在客户端填入自己的中继 IP，即刻获得超越向日葵数百元 VIP 的 60 帧流畅体验"
            ],
            "difficulty": "medium"
        },
        "official_url": "https://rustdesk.com/",
        "github_url": "https://github.com/rustdesk/rustdesk",
        "github_stars": 76000,
        "description": "GitHub 7.6 万星标的开源远程桌面第一神器。向日葵与 ToDesk 的终极开源平替，无设备绑定上限，P2P 直连满速不卡顿。",
        "pros": ["开源纯净无广告，无向日葵令人发指的 30 帧限速和多设备收费", "端到端加密，杜绝商业远程软件的隐私泄露风险", "支持全平台控制"],
        "cons": ["全国晚高峰时官方公共中继偶尔有延迟，自建服务器体验最佳"],
        "target_slug": "sunlogin-todesk",
        "is_chinese": True
    },
    {
        "id": 137,
        "name": "RayLink",
        "slug": "raylink",
        "free_tier": 3,
        "free_tier_detail": "个人免费版提供 4K 60fps 画面传输、超低延迟、支持数位板压感与游戏手柄穿透",
        "tags": ["超低延迟", "4K60帧", "设计师首选", "个人免费", "免配置"],
        "platforms": ["Windows", "macOS", "iOS", "Android"],
        "pricing_truth": {
            "core": {"status": "free", "note": "个人远程控制、4K 60fps 传输、手柄/数位板穿透全部免费"},
            "sync": {"status": "free", "note": "个人绑定设备无繁琐限制"},
            "export": {"status": "free", "note": "免费大文件点对点高速传输"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "免折腾获得 4K 60fps 设计级远程体验",
            "steps": [
                "在两台电脑分别下载并安装 RayLink",
                "注册个人账号登录并绑定设备",
                "在显示设置中勾选「4K 超清」与「60 FPS 高帧率模式」",
                "享受丝滑如本地操作的远程剪辑、制图与办公"
            ],
            "difficulty": "low"
        },
        "official_url": "https://www.raylink.com/",
        "github_url": None,
        "github_stars": 0,
        "description": "专为设计、视频后期与游戏开发打造的高性能远程控制软件。个人版免费提供 4K 60 帧画质和数位板压感，色彩精准，免除商业版限速困扰。",
        "pros": ["画质极高，色彩还原远超向日葵普通版", "支持数位板手绘压感穿透", "免自建服务器，小白下载即享超高帧率"],
        "cons": ["多路并发集中管控需团队版支持"],
        "target_slug": "sunlogin-todesk",
        "is_chinese": True
    },
    {
        "id": 138,
        "name": "123云盘",
        "slug": "123pan",
        "free_tier": 3,
        "free_tier_detail": "注册即赠 2TB 免费空间，下载完全不限速，分享文件他人无需登录即可满速下载",
        "tags": ["国内免限速", "2TB免费空间", "免登录下载", "良心网盘", "满速直链"],
        "platforms": ["Windows", "macOS", "Android", "iOS", "Web"],
        "pricing_truth": {
            "core": {"status": "free", "note": "上传、在线解压、极速下载完全免费，绝无几十KB限速"},
            "sync": {"status": "free", "note": "2TB 免费超大云端储存空间"},
            "export": {"status": "free", "note": "分享文件接收方免安装客户端、免登录直接网页高速下载"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "免开超级会员实现文件满速分发与下载",
            "steps": [
                "注册 123 云盘账号直接领取免费 2TB 空间",
                "上传需要分发的大文件（视频、安装包、资料）",
                "创建分享链接发送给朋友或同事",
                "对方在手机或电脑浏览器中直接点击即可跑满宽带下载，无需被强制装 App"
            ],
            "difficulty": "low"
        },
        "official_url": "https://www.123pan.com/",
        "github_url": None,
        "github_stars": 0,
        "description": "国内少有的真正良心不限速网盘。免费赠送 2TB 空间，不设恶性限速墙，大文件分享接收方无需登录直接满速下载，百度网盘的完美平替。",
        "pros": ["下载不限速，实测轻松跑满 1000M 宽带", "分享文件接收方体验极佳，免登录免装 App", "免费存储空间充裕"],
        "cons": ["单日超大批量 GB 转存有合规审核额度"],
        "target_slug": "baidu-pan",
        "is_chinese": True
    },
    {
        "id": 139,
        "name": "PDF24 Creator",
        "slug": "pdf24-creator",
        "free_tier": 1,
        "free_tier_detail": "德国著名完全免费无广告 PDF 工具箱，本地离线运行，PDF 转 Word、合并、压缩、OCR 全部无限制免费",
        "tags": ["德国神器", "100%离线免费", "零广告", "PDF转换", "无限制"],
        "platforms": ["Windows", "Web"],
        "pricing_truth": {
            "core": {"status": "free", "note": "PDF 转 Word/Excel/PPT、页面提取、页面排序完全免费"},
            "sync": {"status": "free", "note": "本地客户端 100% 离线运算，机密合同绝不上传云端"},
            "export": {"status": "free", "note": "不限页数、不限大小、无任何导出限制与收费弹窗"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "告别国产流氓 PDF 转换器按页收费套路",
            "steps": [
                "前往 PDF24 官网下载 Windows 客户端（安装包干净无捆绑）",
                "打开工具箱，选择「PDF 转 Word」或「PDF 文本识别 OCR」",
                "拖入任何几十上百页的长文档，本地极速转换完成",
                "直接打开生成的 .docx 文件，排版保持原样，分文不花"
            ],
            "difficulty": "low"
        },
        "official_url": "https://www.pdf24.org/",
        "github_url": None,
        "github_stars": 0,
        "description": "享誉全球的极客级全能 PDF 工具箱。彻底终结国产 PDF 软件转前免费、转后按页敲诈的流氓行径，无广告无限制，支持离线 OCR 文字识别。",
        "pros": ["不限制转换页数与次数，终身零元使用", "本地离线处理，避免机密商务合同被上传泄密", "功能极其丰富，涵盖 30+ 种 PDF 工具"],
        "cons": ["客户端仅原生支持 Windows，Mac 用户推荐使用其纯净网页版或 Stirling-PDF"],
        "target_slug": "china-pdf-tools",
        "is_chinese": True
    },
    {
        "id": 140,
        "name": "LX Music (洛雪音乐助手)",
        "slug": "lx-music",
        "free_tier": 1,
        "free_tier_detail": "开源纯净多平台音乐客户端，本身零广告开源免费，支持导入社区公开音源畅听全网无损",
        "tags": ["开源神作", "50kStars", "全网曲库", "无损畅听", "零广告"],
        "platforms": ["Windows", "macOS", "Linux", "Android"],
        "pricing_truth": {
            "core": {"status": "free", "note": "歌曲搜索、无损播放、歌词滚动、歌单管理全部免费"},
            "sync": {"status": "free", "note": "支持本地备份与 WebDAV 歌单云同步"},
            "export": {"status": "free", "note": "音质支持标准、高品与无损 FLAC 模式"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "一键激活全网无损音乐曲库",
            "steps": [
                "从 GitHub 下载安装 LX Music 客户端",
                "打开软件进入「设置 -> 基本设置 -> 自定义源管理」",
                "导入社区开源的六音音源脚本接口 URL",
                "搜索任何周杰伦、陈奕迅等 VIP 变灰歌曲，直接享受无损原音畅听"
            ],
            "difficulty": "medium"
        },
        "official_url": "https://github.com/lyswhut/lx-music-desktop",
        "github_url": "https://github.com/lyswhut/lx-music-desktop",
        "github_stars": 51000,
        "description": "GitHub 超 5 万星标的开源音乐第一神器。彻底摆脱网易云音乐与 QQ 音乐满屏直播广告、歌曲频繁变灰需要购买多份 VIP 的烦恼。",
        "pros": ["界面干净优雅现代，没有任何直播、社交开屏广告骚扰", "跨平台支持 Windows、Mac 和安卓手机", "支持无损音质自由切换"],
        "cons": ["首次使用需花 1 分钟导入公开音源脚本"],
        "target_slug": "netease-music",
        "is_chinese": True
    },
    {
        "id": 141,
        "name": "Legado (开源阅读)",
        "slug": "legado-reader",
        "free_tier": 1,
        "free_tier_detail": "GitHub 8万星标安卓开源最强阅读神器，0广告0收费，支持一键导入全网海量公开书源与微软真人朗读",
        "tags": ["80kStars", "开源阅读第一", "全网书源", "微软晓晓TTS", "零广告"],
        "platforms": ["Android", "Web"],
        "pricing_truth": {
            "core": {"status": "free", "note": "书籍阅读、目录解析、翻页特效、离线缓存全部免费"},
            "ai": {"status": "free", "note": "支持接入微软 Edge 晓晓等高质量神经拟真真人语音朗读"},
            "sync": {"status": "free", "note": "支持 WebDAV 免费多端云同步进度与书架"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "打造全网免费个人移动图书馆",
            "steps": [
                "安卓手机安装开源阅读（Legado）App",
                "进入「我的 -> 书源管理 -> 网络导入」，填入社区通用公开优质书源网络地址",
                "搜索任何网络小说或出版名著，一键加入书架，享受无任何弹窗广告的精致阅读体验"
            ],
            "difficulty": "medium"
        },
        "official_url": "https://github.com/gedoor/legado",
        "github_url": "https://github.com/gedoor/legado",
        "github_stars": 82000,
        "description": "安卓生态无出其右的开源阅读神器。无需开通连环扣费会员卡，0 弹窗广告，支持导入海量正规书源与微软满血真人语音听书。",
        "pros": ["零广告体验极度沉浸，排版精致美观", "接入微软晓晓等顶级 AI 拟真语音，堪比专业有声书主播", "离线缓存无流量忧虑"],
        "cons": ["原生仅限安卓生态，iOS 平台推荐使用爱阅书香或源阅读"],
        "target_slug": "china-reader-apps",
        "is_chinese": True
    },
    {
        "id": 142,
        "name": "Scrcpy",
        "slug": "scrcpy",
        "free_tier": 1,
        "free_tier_detail": "11万星标开源安卓超清低延迟投屏与反向控制神器，USB/WiFi 即插即用，免费提供 4K 60fps 满帧传输",
        "tags": ["110kStars", "低延迟投屏", "4K60帧", "免Root", "跨平台神器"],
        "platforms": ["Windows", "macOS", "Linux"],
        "pricing_truth": {
            "core": {"status": "free", "note": "高清投屏、鼠标键盘反向操控、剪贴板互通完全免费"},
            "sync": {"status": "free", "note": "支持声音同步传输与录屏无水印输出"},
            "export": {"status": "free", "note": "无需在手机安装任何驻留 App，免 Root"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "0元获得专业级 60 帧无感投屏体验",
            "steps": [
                "在电脑端解压 Scrcpy 绿色版，手机在设置中开启「USB 调试」",
                "通过数据线连接电脑，双击运行 scrcpy.exe",
                "手机屏幕即刻以 60fps 超低延迟镜像在电脑屏幕上，支持直接用电脑键鼠打字与刷视频"
            ],
            "difficulty": "medium"
        },
        "official_url": "https://github.com/Genymobile/scrcpy",
        "github_url": "https://github.com/Genymobile/scrcpy",
        "github_stars": 118000,
        "description": "全球排名第一的开源安卓投屏与电脑控制工具。替代各类国产投屏软件繁琐的广告与按月付费套路，纯净、满帧、免安装手机客户端。",
        "pros": ["延迟低至 30ms，几乎感知不到任何画面拖影", "支持电脑直接拖拽文件快速传输到手机", "完全免费无限制"],
        "cons": ["初次使用需要在安卓手机开启开发者模式和 USB 调试"],
        "target_slug": "china-screen-mirror",
        "is_chinese": True
    },
    {
        "id": 143,
        "name": "留痕 (MemoTrace)",
        "slug": "memotrace",
        "free_tier": 1,
        "free_tier_detail": "开源离线微信聊天记录提取、备份与数据还原神器，本地解密，支持导出网页 HTML、PDF 与文本",
        "tags": ["微信备份", "聊天记录导出", "本地离线安全", "开源免费", "换机必备"],
        "platforms": ["Windows"],
        "pricing_truth": {
            "core": {"status": "free", "note": "微信个人/群聊记录提取、语音转文字、图片视频还原全部免费"},
            "sync": {"status": "free", "note": "本地磁盘直接读取，绝不上报任何私人对话数据"},
            "export": {"status": "free", "note": "支持完整导出为优雅排版的离线网页、PDF 电子书"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "永久备份并导出珍贵微信聊天记录",
            "steps": [
                "下载并运行 MemoTrace（留痕）开源客户端",
                "打开电脑端微信并登录，工具自动识别本地离线数据库路径",
                "选择需要备份的联系人或微信群，一键开始解析",
                "导出为包含完整表情包、语音、图片的 HTML 网页文件，永久保存在移动硬盘中"
            ],
            "difficulty": "medium"
        },
        "official_url": "https://memotrace.cn/",
        "github_url": "https://github.com/LC044/WeChatMsg",
        "github_stars": 32000,
        "description": "解决微信占用几十G手机存储且无法放心清理的终极开源神器。本地解密导出微信聊天记录，彻底终结商业数据恢复软件数百元的乱收费陷阱。",
        "pros": ["完全离线运行在个人电脑上，隐私零泄露风险", "导出的网页完整还原微信真实对话气泡与语音表情", "免费无限制"],
        "cons": ["需在电脑端微信曾勾选过保留聊天记录历史"],
        "target_slug": "wechat-backup-tools",
        "is_chinese": True
    },
    {
        "id": 144,
        "name": "7-Zip / 360压缩国际纯净版",
        "slug": "clean-zip",
        "free_tier": 1,
        "free_tier_detail": "7-Zip 终身开源免费；360压缩国际版面向海外，零弹窗、零开屏广告、零推广关联",
        "tags": ["开源良心", "零弹窗", "告别流氓软件", "极速解压", "纯净无捆绑"],
        "platforms": ["Windows"],
        "pricing_truth": {
            "core": {"status": "free", "note": "7z, zip, rar, tar 等数十种格式压缩与解压全部免费"},
            "sync": {"status": "free", "note": "本地纯净运行，零联网弹窗骚扰"},
            "export": {"status": "free", "note": "自研 7z 高压缩比算法，省出大量硬盘空间"}
        },
        "hack_guide": {
            "has_hack": True,
            "title": "彻底拔除电脑右下角流氓弹窗广告",
            "steps": [
                "进入控制面板，卸载好压、快压或各类国产带弹窗的解压软件",
                "前往 7-Zip 官网或 360 国际官网安装 360 Zip（国际纯净版）",
                "关联常用 .zip, .rar, .7z 文件后缀",
                "电脑彻底恢复清爽，右下角再无任何劣质页游与低俗资讯广告弹窗"
            ],
            "difficulty": "low"
        },
        "official_url": "https://www.7-zip.org/",
        "github_url": None,
        "github_stars": 0,
        "description": "解压软件的唯一正解。7-Zip 开源极客典范，360 国际版无广告现代化界面，彻底消灭国产流氓压缩软件恶性弹窗全家桶。",
        "pros": ["零广告、零弹窗、零后台静默安装捆绑", "压缩比极高，解压速度飞快", "永久免费放心使用"],
        "cons": ["7-Zip 原生图标较为复古，追求高颜值可选择 360 压缩国际版"],
        "target_slug": "china-zip-tools",
        "is_chinese": True
    }
]

existing_alt_slugs = {a["slug"]: a for a in alternatives}
for na in new_alts:
    tslug = na["target_slug"]
    target = target_map.get(tslug)
    if not target:
        print(f"Warning: target {tslug} not found")
        continue
    
    cat = next((c for c in categories if c["id"] == target.get("category_id")), {})
    
    item = {
        "id": na["id"],
        "name": strip_emojis(na["name"]),
        "slug": na["slug"],
        "free_tier": na["free_tier"],
        "free_tier_detail": strip_emojis(na["free_tier_detail"]),
        "tags": [strip_emojis(t) for t in na["tags"]],
        "platforms": [strip_emojis(p) for p in na["platforms"]],
        "pricing_truth": na["pricing_truth"],
        "hack_guide": na["hack_guide"],
        "official_url": na["official_url"] or "",
        "github_url": na["github_url"] or "",
        "github_stars": na["github_stars"] or 0,
        "description": strip_emojis(na["description"]),
        "pros": [strip_emojis(p) for p in na["pros"]],
        "cons": [strip_emojis(c) for c in na["cons"]],
        "is_chinese": True,
        "target": {
            "id": target.get("id"),
            "name": target.get("name"),
            "slug": target.get("slug"),
            "price_info": target.get("price_info"),
            "official_url": target.get("official_url"),
            "category_id": cat.get("id"),
            "category_name": cat.get("name"),
            "category_slug": cat.get("slug"),
            "is_chinese": True
        }
    }
    
    if na["slug"] not in existing_alt_slugs:
        alternatives.append(item)
    else:
        idx = next(i for i, x in enumerate(alternatives) if x["slug"] == na["slug"])
        alternatives[idx] = item

# Mark is_chinese on all alternatives where target is Chinese
for a in alternatives:
    target_obj = a.get("target") or {}
    tslug = target_obj.get("slug") or ""
    tname = target_obj.get("name") or ""
    if tslug in chinese_slugs or any(k in tname for k in ["WPS", "剪映", "XMind", "有道", "腾讯", "钉钉", "飞书", "百度", "迅雷", "115", "阿里", "360", "网易", "向日葵", "微信", "流氓"]):
        a["is_chinese"] = True
        if a.get("target"):
            a["target"]["is_chinese"] = True
    else:
        if "is_chinese" not in a:
            a["is_chinese"] = False

payload = {
    "categories": categories,
    "targets": targets,
    "alternatives": alternatives
}

json_str = json.dumps(payload, ensure_ascii=False, indent=2)

# Check emojis
emoji_pattern = re.compile(
    r"[\U00010000-\U0010ffff\u2600-\u27bf\u2300-\u23ff\u2b50\u200d\ufe0f]"
)
matches = emoji_pattern.findall(json_str)
if matches:
    print(f"Error: Found emojis: {set(matches)}")
else:
    with open(data_path, "w", encoding="utf-8") as f:
        f.write(json_str)
    print(f"Successfully updated {data_path}! Total targets: {len(targets)}, total alternatives: {len(alternatives)}")
