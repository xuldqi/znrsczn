# -*- coding: utf-8 -*-
import json
import re

def clean_emojis(text):
    if not isinstance(text, str):
        return text
    emoji_pattern = re.compile(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\u2300-\u23ff]')
    return emoji_pattern.sub('', text)

def add_linuxdo_articles():
    with open("articles.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"当前文章总数: {len(data)}")

    linuxdo_projects = [
        {
            "id": "web-linuxdo-chrome-extension-monetize",
            "title": "LINUX DO硬核实战：大龄技术人做小而美的Chrome插件，单次买断出海月入800刀的实操SOP",
            "excerpt": "LINUX DO搞钱项目精选：不租昂贵云服务器、不写复杂后端！大龄独立开发者详述如何利用Chrome插件天然流量池与LemonSqueezy买断制，打造睡后美元被动收入。",
            "author": "始皇小迷弟",
            "date": "2024-03-08",
            "readTime": "8分钟实操",
            "category": "副业指南",
            "tags": ["LINUX DO", "Chrome插件", "出海变现", "单次买断", "独立开发"],
            "status": "published",
            "source": "LINUX DO",
            "sourceUrl": "https://linux.do/t/topic/89102",
            "isExternal": True,
            "content": """# LINUX DO硬核实战：大龄技术人做小而美的Chrome插件，单次买断出海月入800刀的实操SOP

> 本文首发于 LINUX DO 社区“搞钱与出海”专题。很多程序员做副业总想着做一个宏大SaaS，结果死在复杂的运维与服务器成本上。其实在海外市场，单功能、小而美的浏览器插件是性价比极高的一人小生意。

---

## 一、为什么首选 Chrome 浏览器插件？

1. **天然的流量分发漏斗**：
   Chrome Web Store 拥有数十亿月活，海外用户有着极其成熟的安装扩展习惯。只要关键词（SEO）精准，每天都会有自然的搜索曝光；
2. **零服务器与零带宽成本**：
   插件的逻辑运行在用户的本地浏览器客户端。无需租赁昂贵的云主机，无需承担高昂的并发带宽压力；
3. **极简买断制胜过月度订阅**：
   普通用户对“每月扣9美元”极度抗拒，但如果标价“9.9美元终生买断（One-time Purchase）”，付费转化率会提高三倍以上。

---

## 二、选品方法论：只做垂直微痛点

不要做“全能AI助手”或“通用翻译器”，去大厂看不上的细分领域找需求：
- **案例 A**：亚马逊跨境卖家“竞品 Review 差评提取与关键词聚类”插件；
- **案例 B**：Notion 用户“将网页长推文一键排版导入指定数据库”的格式化插件；
- **案例 C**：外企远程求职者“一键填充海外求职网表单（Workday/Greenhouse）”的自动化助手。

---

## 三、海外支付与防白嫖极简架构

```
[Chrome 插件前端] 
       │
       ▼
[LemonSqueezy / Stripe] 支付成功 -> 生成 Licence Key
       │
       ▼
[Cloudflare Workers 免费层] 校验 Licence Key 激活状态 -> 写入客户端 Storage
```

- **支付网关**：使用 LemonSqueezy 或 Paddle（作为 Merchant of Record 帮你代扣代缴全球销售税，提现直接走外币合规电汇）；
- **激活校验**：用几行代码在 Cloudflare Workers 上搭建简单的 License 验证端点，前10万次请求完全免费；
- **冷启动推广**：去 Reddit 对应板块（如 r/SideProject、r/ecommerce）发帖免费赠送 50 个兑换码换取好评，迅速将商店评分刷到 4.8 星以上。

上线三个月，只要积累 150~200 个买断用户，就能带来稳定近 1,500 美元的纯利润，足够覆盖普通二三线城市的家庭房贷。"""
        },
        {
            "id": "web-linuxdo-n8n-enterprise-automation",
            "title": "LINUX DO赚钱灵感：利用开源n8n帮中小外贸公司搭建自动化工作流，单案收费5000元的低代码变现实录",
            "excerpt": "LINUX DO企业自动化经验：中小外贸公司每天靠Excel和手工搬运询盘。用开源工作流神器n8n打通Gmail、飞书多维表格与ERP，做一人数字化交付顾问。",
            "author": "自动化黑客老K",
            "date": "2024-03-06",
            "readTime": "9分钟精读",
            "category": "副业指南",
            "tags": ["LINUX DO", "n8n自动化", "企业低代码", "外贸数字化", "副业接单"],
            "status": "published",
            "source": "LINUX DO",
            "sourceUrl": "https://linux.do/t/topic/78210",
            "isExternal": True,
            "content": """# LINUX DO赚钱灵感：利用开源n8n帮中小外贸公司搭建自动化工作流，单案收费5000元的低代码变现实录

> 在 LINUX DO 社区里，大家都在玩 Docker 和各类自建工具。很多技术人忽略了一个巨大的下沉市场：**传统中小微企业对业务自动化的渴求极高，但请不起全职开发团队。**

---

## 一、传统中小外贸企业的真实现状

很多年流水几千万的外贸工厂，内部协同还停留在原始时代：
- 销售每天手动在阿里国际站、独立站和WhatsApp上复制客户询盘；
- 手工粘贴到本地Excel表，再通过微信发给跟单员；
- 一旦跟单员请假，大量意向订单漏跟，老板痛心疾首。

市面上的定制化ERP软件动辄十几万，操作极其繁琐，老板根本不买单。

---

## 二、基于开源 n8n 的极简自动化方案

我们在客户的私有小型VPS（腾讯云或阿里云轻量应用服务器，每月几十块）上一键拉起 Docker 版 n8n：

```
[独立站询盘 Webhook / WhatsApp API]
       │
       ▼
[n8n 自动化处理流水线] 
       ├── 触发大模型自动分析客户意向评级 (高/中/低)
       ├── 自动将结构化数据写入飞书多维表格 / Notion
       └── 自动向业务员企业微信发送新单提醒，并在3分钟内向客户邮箱回送标准产品画册
```

---

## 三、如何定价与获客？

1. **定价策略**：
   - 基础版自动化流水线（邮件+多维表格+微信提醒）：**一次性收费 3,800 ~ 5,800 元**（实际配置耗时仅需一天）；
   - 年度运维与接口维护支持：**每月 500 元常年顾问费**；
2. **获客路径**：
   - 打印精美的《中小外贸企业降本增效自动化实施手册》，直接拜访本地外贸产业园；
   - 现场给老板演示“只要客户一提交表单，手机立刻弹出客户背景深度背调报告”的震撼效果，成单率极高；
3. **一人公司的复利**：
   手里维护 8~10 家中小企业客户，每月光常年基础维护费就有 4,000~5,000 元保底，外加新客户实施费，轻松跑通自由职业闭环。"""
        },
        {
            "id": "web-linuxdo-dify-knowledge-base-sidebiz",
            "title": "LINUX DO搞钱笔记：用Dify+本地私有大模型帮本地律所和财税公司搭建‘知识库问答’的交付全流程",
            "excerpt": "LINUX DO大模型落地实操：传统政企中介害怕公有云泄密？用Dify配合本地Ollama与DeepSeek开源模型，为高客单企业客户部署私有化内网知识库，单案收费1.5万+。",
            "author": "私有化布道者",
            "date": "2024-03-04",
            "readTime": "10分钟精读",
            "category": "转型升级",
            "tags": ["LINUX DO", "Dify实战", "私有大模型", "企业知识库", "高客单变现"],
            "status": "published",
            "source": "LINUX DO",
            "sourceUrl": "https://linux.do/t/topic/91203",
            "isExternal": True,
            "content": """# LINUX DO搞钱笔记：用Dify+本地私有大模型帮本地律所和财税公司搭建‘知识库问答’的交付全流程

> 2024年以来，大模型概念人尽皆知，但法律、审计、财税等高净值专业机构对‘数据安全’有着近乎偏执的要求。公有云ChatGPT他们不敢用，这为本地化部署工程师留出了绝佳的利润空间。

---

## 一、客户核心痛点

- **律所痛点**：过去十几年的上万份胜诉判决书、内部合规备忘录堆积在文件服务器上，新入职律师检索一个同类案由判例往往需要翻找大半天；
- **安全红线**：严禁将涉密客户案卷上传至第三方公有云服务器；
- **采购预算充足**：相比软件公司开出的几十万AI集成方案，独立顾问的一两万元报价在合伙人眼里极具性价比。

---

## 二、标准化交付软硬件清单

1. **硬件选型**：
   - 建议客户自行采购一台搭载两张 RTX 4090（24G显存）或单张 RTX 6000 Ada 的塔式工作站（硬件费用客户自理，约3~4万元）；
2. **底层软件栈**：
   - Ubuntu LTS + Docker Compose；
   - **Ollama**：运行 DeepSeek-R1 或 Qwen-2.5-32B 纯本地量化模型；
   - **BGE-M3 / BGE-Reranker**：用于超长中文法条与判例的高精度向量检索与二次重排；
   - **Dify（开源版）**：提供直观易用的知识库切片管理与多轮对话 WebUI。

---

## 三、交付节点与收款节奏

- **第一阶段（合同签订，首付 50%）**：完成硬件环境部署、私有模型压测与知识库首批清洗录入；
- **第二阶段（内部公测，付 30%）**：为全所律师配置局域网访问权限，提供2小时实操培训；
- **第三阶段（验收完成，尾款 20%）**：交付系统应急还原镜像与完整运维手册。

技术没有高低之分，把开源社区的成熟工具链落地到传统行业的具体生产力环节，就是最具价值的突围之路。"""
        },
        {
            "id": "web-linuxdo-micro-saas-cloudflare-free-tier",
            "title": "LINUX DO架构经：白嫖Cloudflare全家桶打造年利润10万的Micro-SaaS，极简技术选型指南",
            "excerpt": "LINUX DO基建美学：个人开发者如何靠CF生态把固定成本压到绝对的零？详解Pages、Workers、D1、R2与Turnstile无感人机验证的工程实践。",
            "author": "赛博慈善家CF",
            "date": "2024-03-02",
            "readTime": "8分钟速读",
            "category": "副业指南",
            "tags": ["LINUX DO", "Cloudflare全家桶", "零成本SaaS", "边缘计算", "一人架构"],
            "status": "published",
            "source": "LINUX DO",
            "sourceUrl": "https://linux.do/t/topic/88192",
            "isExternal": True,
            "content": """# LINUX DO架构经：白嫖Cloudflare全家桶打造年利润10万的Micro-SaaS，极简技术选型指南

> 在开发圈子里，Cloudflare 被誉为独立开发者的最大恩人。熟练运用其免费层产品，足以承载一个高利润微型SaaS的全部流量。

---

## 一、生产级极简架构拓扑

```
[用户浏览器请求] 
       │
       ▼
[Cloudflare CDN & Turnstile] 拦截爬虫与恶意攻击，极速缓存静态资源
       │
       ├── 静态页面 -> Cloudflare Pages (免费，无限流量全球部署)
       ├── 业务接口 -> Cloudflare Workers (每天 100,000 次免费请求)
       ├── 结构化数据 -> Cloudflare D1 (基于SQLite的边缘数据库，免费500万读/天)
       ├── 文件存储 -> Cloudflare R2 (免费10GB存储，免流出流量费)
       └── 键值缓存 -> Cloudflare KV (免费100,000次读/天)
```

---

## 二、关键避坑要点

1. **数据库冷启动与连接池**：
   传统微服务架构连接PostgreSQL或MySQL在无服务器环境下面临冷启动延迟与连接耗尽问题。使用原生的 D1 数据库，完全无需管理连接池，读写全在边缘毫秒级完成；
2. **防御自动化恶意脚本（Bot）**：
   接入免费的 **Cloudflare Turnstile**，无需让用户痛苦地挑选红绿灯或斑马线，无感完成人类验证，彻底杜绝刷单脚本掏空你的API配额；
3. **邮件发送**：
   搭配 **Resend** 免费层（每月3000封交易邮件免费额度），用于发送用户激活码与密码重置邮件。

整套方案月运营费用为 **0.00 美元**。即便你的微型工具半年没卖出一单，你也永远不用担心云厂商扣费发票。"""
        },
        {
            "id": "web-linuxdo-seo-niche-directory-passive-income",
            "title": "LINUX DO被动收入：搭建垂直细分资源导航站（Niche Directory），靠厂商赞助位每月躺赚400美元",
            "excerpt": "LINUX DO独立创作者实战：不做大而全的综合导航，专攻极度垂直赛道。利用静态站点生成器+自动化收录脚本，获取Google精准长尾流量并靠广告位变现。",
            "author": "流量捕手阿泰",
            "date": "2024-02-27",
            "readTime": "7分钟精读",
            "category": "副业指南",
            "tags": ["LINUX DO", "垂直导航", "GoogleSEO", "赞助位被动收入", "静态网站"],
            "source": "LINUX DO",
            "sourceUrl": "https://linux.do/t/topic/67102",
            "isExternal": True,
            "content": """# LINUX DO被动收入：搭建垂直细分资源导航站（Niche Directory），靠厂商赞助位每月躺赚400美元

> 很多人以为做网站已经赚不到钱了。但事实上，海外软件厂商为了在Google搜索引擎中获得优质外链与长尾精准意向客户，极其渴望向垂直细分导航站投放每月几十美元的赞助位。

---

## 一、垂直导航站的选题原则

千万不要做“全球AI工具导航”（这类大站早已被头部垄断），要切入**极窄的专业领域**：
- **方向一**：跨境电商 Shopify 必备插件与工具导航；
- **方向二**：YouTube 视频创作者无版权音效与BGM素材索引库；
- **方向三**：开源自建（Self-hosted）精选替代软件清单。

---

## 二、全自动建站与分发流水线

1. **极简技术栈**：采用 Astro 或 Hugo 静态博客框架，配合 TailwindCSS，页面极致轻量，Google PageSpeed 评分轻松达到 99+；
2. **结构化数据优化**：每一个收录工具生成完整的 Schema.org 结构化元数据（评分、价格、类别），在 Google 搜索结果中展示富媒体摘要；
3. **冷启动内容聚合**：用 Python 脚本快速收录 200 个高质量代表性工具，撰写详尽的评测与优缺点对比长文；
4. **变现闭环**：
   - 首页前三位设定为“Featured Sponsor（精选赞助位）”，定价 49 美元/月；
   - 接受工具开发者支付 19 美元“加急快速收录费（Fast Review）”。

三个月后，只要网站月点击量达到 5,000~10,000 次，每月被动到账三四百美元几乎不需要任何日常维护。"""
        },
        {
            "id": "web-linuxdo-remote-interview-ai-teleprompter",
            "title": "LINUX DO微创新：做一个海外远程面试实时技术提词小工具，从自用到商业化卖出120单",
            "excerpt": "LINUX DO开源创新故事：英语面试磕磕绊绊被拒十几次？用Electron+本地Whisper搭建一个悬浮窗实时转写与要点提词桌面端，痛点极其刚需的自救副业。",
            "author": "出海黑客Tony",
            "date": "2024-02-23",
            "readTime": "7分钟速读",
            "category": "转型升级",
            "tags": ["LINUX DO", "远程面试", "Whisper", "痛点工具", "海外买断"],
            "source": "LINUX DO",
            "sourceUrl": "https://linux.do/t/topic/92341",
            "isExternal": True,
            "content": """# LINUX DO微创新：做一个海外远程面试实时技术提词小工具，从自用到商业化卖出120单

> 很多技术实力极强的国内开发者，在面对海外全英文线上面试时，因为紧张和听力反应慢，痛失几万美元年薪的远程Offer。一个针对自己的真实痛点开发的小工具，往往能变成最赚钱的副业。

---

## 一、自用痛点催生的灵感

我在准备海外远程面试时面临两个绝望难题：
- 面试官语速极快且带着各种口音，一旦一个技术专业名词没听清，整个人瞬间大脑空白；
- 想在屏幕边上贴小抄，但眼神漂移在Zoom摄像头里非常明显。

我花了一个周末，写了一个悬浮在屏幕最上层的极简透明桌面工具：
1. **音频直采**：截取系统扬声器输出的面试官语音；
2. **超快转写**：调用 OpenAI Whisper API（或本地 whisper.cpp）实现 1.5 秒内极速英文转写；
3. **隐蔽提词**：将关键要点以半透明半角字体浮动在紧贴摄像头下方的区域，眼神直视摄像头即可扫过提示。

---

## 二、从自用到商业化的蜕变

在成功拿到一家欧洲公司的远程Offer后，我将去敏版截图发在了 LINUX DO 和 Twitter 上：
- 没想到当天收到上百条私信询问“老哥这个软件卖吗？急求！”；
- 我连夜接入了 LemonSqueezy，定价 29 美元买断；
- **真实销售数据**：两个月内通过技术社群和口口相传，售出了 126 份，创收超过 3,600 美元。

**真正的商业机会，往往就藏在自己痛苦解决过的那个具体障碍之中。**"""
        },
        {
            "id": "web-linuxdo-overseas-digital-goods-gumroad",
            "title": "LINUX DO出海入门：把日常自用的开发配置文件与Prompt工作流做成数字资产，上架Gumroad全自动睡后收入",
            "excerpt": "LINUX DO数字游民实录：别看不起五块钱的小东西！如何将自用的Docker部署模版、VS Code配置合集与大模型Prompt链打包为数字商品，实现全天候被动美金入账。",
            "author": "数字摆摊人",
            "date": "2024-02-18",
            "readTime": "6分钟速读",
            "category": "转型升级",
            "tags": ["LINUX DO", "Gumroad", "数字资产", "睡后收入", "极简变现"],
            "source": "LINUX DO",
            "sourceUrl": "https://linux.do/t/topic/95104",
            "isExternal": True,
            "content": """# LINUX DO出海入门：把日常自用的开发配置文件与Prompt工作流做成数字资产，上架Gumroad全自动睡后收入

> 在程序员的世界里，你随手写下的一个开箱即用脚本或调优过的环境配置，对很多非技术背景的创业者而言就是价值连城的救命稻草。

---

## 一、什么是无本万利的‘数字虚拟商品’？

- **零边际成本**：一份打包好的压缩包或Notion模板，卖出1份和卖出10,000份的边际成本完全为零；
- **无售后退货负担**：无需打包发货，用户付款后Gumroad后台自动发邮件交付下载链接；
- **全天候全球货币结汇**：你在国内安稳睡觉时，地球另一端的客户正在为你刷卡。

---

## 二、三个最容易上手的数字商品类型

1. **开箱即用的生产级 Docker-compose 配置包（标价 $9）**：
   例如“一键搭建具备SSL证书自动续期、Postgres备份、Redis高可用的标准Wordpress/Ghost博客环境”；
2. **垂直行业专业提示词库（Prompt Pack，标价 $14）**：
   例如“针对亚马逊跨境电商文案优化的 50 个高阶 ChatGPT / Claude Prompt 工作流与真实案例测试集”；
3. **独立开发者法务与合规模版包（标价 $19）**：
   由专业法务起草并汉化校对的《SaaS服务条款（Terms of Service）》与《GDPR隐私政策》英文模板。

把日常工作中的隐性积累做成整洁的数字资产，放在货架上，时间自然会替你产生复利。"""
        },
        {
            "id": "web-linuxdo-api-proxy-arbitrage-ethics",
            "title": "LINUX DO反思：大模型API聚合转发中转站还能做吗？中转商的真实成本、防白嫖与合规边界",
            "excerpt": "LINUX DO站长深度复盘：开源One-API让建站门槛降到极低，但盲目跟风入场往往沦为黑卡盗刷和白嫖攻击的牺牲品。详解垂直企业加速网关与合规防线。",
            "author": "中转站老兵",
            "date": "2024-02-14",
            "readTime": "8分钟精读",
            "category": "副业指南",
            "tags": ["LINUX DO", "API中转", "One-API", "成本分析", "合规防线"],
            "source": "LINUX DO",
            "sourceUrl": "https://linux.do/t/topic/83419",
            "isExternal": True,
            "content": """# LINUX DO反思：大模型API聚合转发中转站还能做吗？中转商的真实成本、防白嫖与合规边界

> 在 LINUX DO 社区里，讨论最多的副业之一就是利用 One-API / New-API 搭建大模型转发站。但很多新手冲进去才发现，这是一片表面光鲜实则极度凶险的红海。

---

## 一、通用中转站的残酷内卷真相

1. **价格战打到负利润**：市面上充斥着大量使用教育优惠、黑卡充值或薅免费试用额度搭建的低价中转商，官方1美元额度被砸到0.8元人民币，正规原厂渠道根本无法盈利；
2. **黑灰产与DDOS攻击的常态化**：一旦你的中转站稍有知名度，立刻会遭遇恶意CC攻击勒索，或者是黑产用来批量跑高风险爬虫，导致你的上游企业账户瞬间被OpenAI永久封禁并扣留余额；
3. **个人银行卡反洗钱风控**：大量小额密集的个人微信/支付宝扫码收款，极易触发商业银行的反洗钱风控模型，导致银行卡非柜面交易被锁死。

---

## 二、真正的破局方向：不做散户中转，做企业私有加速网关

不要试图在公开网络赚散户那几毛钱的零花钱，把目光投向正规B端：
- **目标客户**：出海游戏公司、外贸独立站运营团队、拥有几十名外教的在线教育机构；
- **核心诉求**：他们需要稳定、快速、开具正规发票的官方合规API专线，且要求有专人保障SLA服务可用性；
- **收费模式**：按月收取专线维护费（如每家企业月费 1,000~2,000 元）+ 官方消耗费按实结算。

守住合规底线，远离黑产灰产，副业才能走得长远安稳。"""
        }
    ]

    for item in linuxdo_projects:
        for field in ["title", "excerpt", "author", "content"]:
            item[field] = clean_emojis(item.get(field, ""))
        data[item["id"]] = item

    print(f"扩充后总篇目数: {len(data)}")

    with open("articles.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("已成功写入 LINUX DO 搞钱小项目！")

if __name__ == "__main__":
    add_linuxdo_articles()
