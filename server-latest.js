const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 1337;
const DATA_FILE = path.join(__dirname, 'articles.json');
const ORDER_FILE = path.join(__dirname, 'article-order.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');
const COMPLAINTS_FILE = path.join(__dirname, 'complaints.json');
const CATEGORY_FILE = path.join(__dirname, 'categories.json');

const { AlipaySdk, AlipayFormData } = require('alipay-sdk');

// Alipay Configuration - Production
const alipaySdk = new AlipaySdk({
  appId: process.env.ALIPAY_APP_ID || '2021006107647819',
  privateKey: process.env.ALIPAY_PRIVATE_KEY || 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCLRnyoeHrLcPljRUk6pwawlDnr1aci5F8D6p/8EF3YUv4w7J/BeAOukCEr5bKgKpmYsjMScPlZTwFGFpcjHC13upuJUntCGLzFdLm6NwnypuOG+PT3jx9a5eOeFLbsCzaiYQGXTJsP3cTLGFrzV4HFpuF/gAJUzzgN0mhU3tzDxcMsIGsjGs6OZQLzzrImM4Up3QhtVP4FmQ1GGdAjYbHWKR8ZJ3tbnkVwLkg/9t8n3i/mdfmEl6o7x4XE+XYZG1BeizJX4GwbryX6TrSrEOcxOsYOFVnkjwfpT3rBG/R6Ol7NQjLEsaulI/bX4XPGKQQqfcsAy+YTkwJYzU2+3du7AgMBAAECggEAfOjNuma7cqQy9qZYQ+My68E0pV9r065PzPprW6zuDap5UTWXHfPeEXwwU+dhKaarNLh1d4+dAk0KDmsKR7Ho0V2qSyGPbDs1aj4CqJDeOiMVIqM7SJ+y9loBp3Bakh6IdF9eBuzskPFLov6H64DK4ZKG4UvUS23Bjxvq+FscUfNDFgJUju0VZU4xf1IfaPxH7USBsQW01+s4NEWhpfuWmcCbApVM2rUjUWs0vuvf4SA23Ey1jjUnHbeciPJT3yTREg43zkKjm4Uyo2Sa4q8T7QmIeI8PQ/sjVvQqyFcBCK89psWb+13sbyCp2tVyFldiU+qedEEZKGdJELgsJmqFGQKBgQDMQh/0jSOepphb9BrXSXX8ZnObxK+oLrdlKjw7jBkvhcSTGT3rBrieDkp8n4ZVSsct57u6qvUa2hhaKK946U/EV1a6WmYNyds5uT5dSEEsZsBKkPX4gejeydOOc+uCnAD/f5a94JYa4ub3xzQnMN6zK1rCqxJ0BWtbk8KJY/5+7wKBgQCujk4H/t43SUfKU/XWNLDzpMB/qePHqFJND3vV/DuTPxwFYpVn7jRVuD9PskJm9GmyK6kAwCTTX//4soCch1LQKBU8he6iHaVltj3eG3uDs+gSZnIhWfZppOb3zVKwphgjhl0K0HTRb9duimSV2NdY3rX2Pi5Jievwy3lZFQev9QKBgAt4KxMwWa+u6x8+tcMg/N8PYa59fN+Uv/eOR5OQalmgyUj5QeDQn81AQC5/RqvDZyvMt13j+59mX7ewUSoY78G2pcgRC2n6y7SSEk5qoD4+Bs4pFaa+pLTd4GM/XxoWaHfwUiaXVdZsp0uChAsvU1H8PTxxHrglFcIuqd3NH51BAoGAb/LGKqyTeaOezi0gujtazTd5Wabsdc0G03M9uZQl5R6Rawa5yUjk+aDLweISYhMYgnMr1VZlh8bG1Ioun7TOML+0NveyfvhCbkP906eOhH3qNXrMcYVP2psuofhlsvMjAg2XOGtOsE9pO/S3476JBe73hjCE4Rb6YZktfytUnc0CgYBiuJh9XwCQaz5CeQAKr4Xe7fSFmsUydC4aOEqW5l8r8fzxAaHozJatZ3DlXoDxYzeCDvhLz7iQSE9zoz703ZOwJF8oeFLE3hKaMCedCOlxXC8aTV5Lfwl+HEk4EDqHnoCdMnORZdjdMbk803+fmR0ca+yfJu7dIoTwPnWoeDlqfw==',
  alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY || 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuBLxZ25pRkgmAIl7NJrarg+Abl8BIOeX4NDD15Kw778zDvkx68FvAIDuO/32EeR8BFzU0tFx2FB7KWDY+ZfUT6ZwbmjY08AaRXNAIAvWsQj3guknSGvIHb9G/ULWJnCEJyQY7sk1KoyzQcFdybbTzAmkFkSKYLa/9Yzipl4Z7geqIv4wc+RL2dEzF8kYDUvTjD1gKuGp+l8HgRHddpR+oNDsu2dxfATWIetiPqxpDeHrwj43f0Ucc0AQ2LIzXSTal7vdMv7R6Hx+h2R1ZZAFRqWpkb5aO7utHGjID9m3y8X/t7s3uHHUg8Q4RJwZZV6d16cnB9/wkgdJFFHQ/KbedwIDAQAB',
  gateway: process.env.ALIPAY_GATEWAY || 'https://openapi.alipay.com/gateway.do',
});

// 确保上传目录存在
const initializeUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch (error) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    console.log('📁 Created upload directory:', UPLOAD_DIR);
  }
};

// 配置multer用于图片上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const randomNum = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}_${randomNum}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件！'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 默认文章数据
const defaultArticles = {};
const defaultOrder = [];
const defaultComplaints = [
  {
    id: '1',
    title: '又被老板画饼了',
    content: '今天老板又说什么"这个需求很重要，关系到公司未来发展"，然后排期就两天。我真的服了，每次都是这样，紧急需求永远比合理规划多。',
    mood: 'frustrated',
    author: '匿名用户A',
    date: '2024-01-20',
    time: '14:30',
    likes: 28,
    comments: 12,
    tags: ['工作压力', '需求管理', '时间紧迫'],
    status: 'approved',
    createdAt: new Date('2024-01-20T14:30:00').toISOString(),
    updatedAt: new Date('2024-01-20T14:30:00').toISOString()
  },
  {
    id: '2',
    title: '开发说技术难度太大',
    content: '好不容易想出一个创新功能，开发直接说"这个技术实现太复杂了，要不换个简单的？"，感觉自己的创新理念总是被技术限制住。',
    mood: 'helpless',
    author: '匿名用户B',
    date: '2024-01-19',
    time: '16:45',
    likes: 15,
    comments: 8,
    tags: ['技术沟通', '项目创新', '团队协作'],
    status: 'approved',
    createdAt: new Date('2024-01-19T16:45:00').toISOString(),
    updatedAt: new Date('2024-01-19T16:45:00').toISOString()
  },
  {
    id: '3',
    title: '用户反馈看不懂',
    content: '用户说"这个功能不好用"，但是问具体哪里不好用，就说不出来了。感觉在做哑谜游戏，到底要怎么样才能真正了解用户需求？',
    mood: 'confused',
    author: '匿名用户C',
    date: '2024-01-18',
    time: '10:20',
    likes: 22,
    comments: 15,
    tags: ['用户研究', '需求分析', '反馈收集'],
    status: 'approved',
    createdAt: new Date('2024-01-18T10:20:00').toISOString(),
    updatedAt: new Date('2024-01-18T10:20:00').toISOString()
  },
  {
    id: '4',
    title: '数据又下降了',
    content: '明明觉得新功能做得很好，结果上线后数据反而下降了。老板问原因，我也不知道该怎么解释，感觉自己的判断力有问题。',
    mood: 'disappointed',
    author: '匿名用户D',
    date: '2024-01-17',
    time: '09:15',
    likes: 31,
    comments: 18,
    tags: ['数据分析', '功能优化', '自我怀疑'],
    status: 'approved',
    createdAt: new Date('2024-01-17T09:15:00').toISOString(),
    updatedAt: new Date('2024-01-17T09:15:00').toISOString()
  },
  {
    id: '5',
    title: '设计师总是不理解我',
    content: '跟设计师解释了半天交互逻辑，结果出来的设计完全不是我想要的效果。感觉沟通成本太高了，有时候真想自己上手做设计。',
    mood: 'tired',
    author: '匿名用户E',
    date: '2024-01-16',
    time: '11:30',
    likes: 19,
    comments: 9,
    tags: ['设计沟通', '交互设计', '团队协作'],
    status: 'approved',
    createdAt: new Date('2024-01-16T11:30:00').toISOString(),
    updatedAt: new Date('2024-01-16T11:30:00').toISOString()
  },
  {
    id: '6',
    title: '',
    content: '人生来这一趟，总是要趟过很多浑水，看到人性的自私、冷漠、欺骗、利用，体会被伤害、被辜负、被冷落、被抛弃。\n\n长大后的人生真的十分不容易。现实总会给我们一记又一记的耳光，很多人没有好的运气，在他还未涉足社会这趟浑水时，就有人教会他自保的方法。\n\n刚毕业就被人以帮忙找工作的由头骗走钱；\n\n好不容易自己找的第一份工作，老板又是个劣迹人士，不给缴纳五险一金；\n\n换工作了又发现，毕业好几年也存不下钱，身边都是豺狼虎豹想从你身上揩下一口油；\n\n于是你又换工作，终于找到一份满意薪资的工作，结果上班一个月就开始被拖欠克扣工资，明明完成工作量也说你不胜任，总之他们总有理由；\n\n你一气之下离职，接着又去面试新的公司，结果发现被HR邀请过去刷KPI，面试了一个小时，面试官问了你所有过往公司的业务模式和逻辑，却不愿意告诉你他们公司的业务信息。你离开后的半小时收到HR的拒信，才缓过神来自己是被叫来套话套经验的；\n\n......\n\n失业久了你开始焦虑，身边的朋友也开始疏离你，毕业时互相慰藉熬过实习期就能转正的舍友，事业顺畅起来也渐渐离你远去。人总是在困难的时候抱团取暖，上岸之后分道扬镳。你开始意识到万事只能靠自己，逢人只说三分话，两分虚假一分糊。\n\n再后来，你说你对人性失望，生活清净了只剩下工作和住所两点一线。你变得不爱社交，留在身边最好的玩伴还是小时候认识的三俩好友。他们不笑你贫，不妒你富，在外过的再怎么样，你们见面还是能够坐在路边摊，点上三两瓶啤酒、炒粉和烤串，然后说着这几年来的辛酸和失意。\n\n你们有人结婚生子，有人在被催婚，还有人从大城市回来决心要在35岁之前考上当地的公务员。小镇做题家们很努力的出去过，在成家而立之年，又灰头土脸的回来，他们说人定胜天，其实人是胜不了天的，只不过那是一代又一代的人托举着下一代，不断的去靠近天际线，突破天际线，但从来没有人到达过天际线。\n\n陨落，陨落，陨落，然后归于尘土，心里的少年死了，甚至没有响起一声唢呐。\n\n我们那凄惨的、失意的、不受控制起起伏伏的人生呐。\n\n————\n\n写的色彩有些萧瑟凄凉，BTW人生还是要往前看，有高峰就会有低谷，学会在清零中勇敢攀登下一个高峰吧！\n\n加油！献给每一个努力生活的人。',
    mood: 'helpless',
    author: '匿名用户F',
    date: '2024-01-15',
    time: '20:45',
    likes: 45,
    comments: 21,
    tags: ['人生感悟', '职场困境', '自我成长'],
    status: 'approved',
    createdAt: new Date('2024-01-15T20:45:00').toISOString(),
    updatedAt: new Date('2024-01-15T20:45:00').toISOString()
  }
];

const defaultCategories = [
  { id: 'family', name: '家庭关系', color: '#ec4899', description: '家庭和睦，关系处理', order: 1 },
  { id: 'career', name: '职场发展', color: '#2563eb', description: '职业规划，技能提升', order: 2 },
  { id: 'psychology', name: '心理健康', color: '#7c3aed', description: '心理调节，情绪管理', order: 3 },
  { id: 'interests', name: '兴趣爱好', color: '#f59e0b', description: '培养兴趣，丰富生活', order: 4 },
  { id: 'life-skills', name: '生活技能', color: '#7c3aed', description: '实用技能，生活窍门', order: 5 },
  { id: 'finance', name: '财务管理', color: '#10b981', description: '理财规划，投资指导', order: 6 },
  { id: 'side-business', name: '副业指南', color: '#06b6d4', description: '副业选择，增收方法', order: 7 },
  { id: 'midlife-crisis', name: '中年危机', color: '#ef4444', description: '危机应对，心理建设', order: 8 },
  { id: 'transformation', name: '转型升级', color: '#64748b', description: '转型指导，能力升级', order: 9 }
];

const forbiddenPatterns = [
  { regex: /(赌博|博彩|彩票代购|赌球|黑彩)/i, message: '包含赌博相关敏感词，无法发布。' },
  { regex: /(色情|约炮|招嫖|裸聊|黄片)/i, message: '包含违规内容，请重新编辑。' },
  { regex: /(发票|代开发票|开票|免税发票)/i, message: '抱歉，禁止发布票务广告。' },
  { regex: /(贷款|信用卡代办|小额贷|高利贷|网贷)/i, message: '检测到金融广告，无法发布。' },
  { regex: /(推广|代理|招商|加盟|返利)/i, message: '包含推广营销类内容，请调整后再发。' },
  { regex: /(加\s*(我|vx|微信|V信)|VX[:：]|v信)/i, message: '请勿发布联系方式或广告。' },
  { regex: /(QQ|企鹅号)[^\d]*(\d{6,})/i, message: '请勿留下 QQ 号等联系方式。' },
  { regex: /((https?:\/\/|www\.)[^\s]+)/i, message: '请勿发布外部链接。' },
  { regex: /\d{3,}[-\s]?\d{3,}[-\s]?\d{4,}/, message: '检测到疑似手机号，请勿留下联系方式。' },
  { regex: /(代购|海淘|包邮|低价出售)/i, message: '禁止发布商品推广或售卖信息。' }
];

const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10分钟
const RATE_LIMIT_MAX = 3;
const submissionTracker = new Map();

// 初始化数据文件
async function initDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultArticles, null, 2));
    console.log('📝 创建了默认文章数据文件');
  }

  try {
    await fs.access(ORDER_FILE);
  } catch (error) {
    await fs.writeFile(ORDER_FILE, JSON.stringify(defaultOrder, null, 2));
    console.log('📝 创建了默认排序文件');
  }
}

async function initComplaintsFile() {
  try {
    await fs.access(COMPLAINTS_FILE);
  } catch (error) {
    await fs.writeFile(COMPLAINTS_FILE, JSON.stringify(defaultComplaints, null, 2));
    console.log('📝 创建了默认留言数据文件');
  }
}

async function initCategoryFile() {
  try {
    await fs.access(CATEGORY_FILE);
  } catch (error) {
    await fs.writeFile(CATEGORY_FILE, JSON.stringify(defaultCategories, null, 2));
    console.log('📝 创建了默认分类数据文件');
  }
}

// 读取文章数据
async function getArticlesData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取文章数据失败:', error);
    return defaultArticles;
  }
}

// 读取排序数据
async function getOrderData() {
  try {
    const data = await fs.readFile(ORDER_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取排序数据失败:', error);
    return defaultOrder;
  }
}

// 保存文章数据
async function saveArticlesData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('保存文章数据失败:', error);
    return false;
  }
}

// 保存排序数据
async function saveOrderData(data) {
  try {
    await fs.writeFile(ORDER_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('保存排序数据失败:', error);
    return false;
  }
}

async function getComplaintsData() {
  try {
    const data = await fs.readFile(COMPLAINTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取留言数据失败:', error);
    return [];
  }
}

async function saveComplaintsData(data) {
  try {
    await fs.writeFile(COMPLAINTS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('保存留言数据失败:', error);
    return false;
  }
}

async function getCategoriesData() {
  try {
    const data = await fs.readFile(CATEGORY_FILE, 'utf8');
    const categories = JSON.parse(data);
    if (Array.isArray(categories)) {
      return categories.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return defaultCategories;
  } catch (error) {
    console.error('读取分类数据失败:', error);
    return defaultCategories;
  }
}

async function saveCategoriesData(data) {
  try {
    const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
    await fs.writeFile(CATEGORY_FILE, JSON.stringify(sorted, null, 2));
    return true;
  } catch (error) {
    console.error('保存分类数据失败:', error);
    return false;
  }
}

function slugify(text = '') {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '') || `category-${Date.now()}`;
}

function validateComplaintContent(content = '') {
  const text = content.trim();
  if (!text) {
    return '内容不能为空。';
  }
  if (text.length < 10) {
    return '内容太短，再多分享一些吧。';
  }
  if (text.length > 2000) {
    return '内容太长，请精简后再提交。';
  }
  for (const { regex, message } of forbiddenPatterns) {
    if (regex.test(text)) {
      return message;
    }
  }
  return null;
}

const USERS_FILE = path.join(__dirname, 'users.json');

// Initialize users file
async function initUsersFile() {
  try {
    await fs.access(USERS_FILE);
  } catch (error) {
    await fs.writeFile(USERS_FILE, JSON.stringify([], null, 2));
    console.log('📝 Created default users file');
  }
}

async function getUsersData() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read users data:', error);
    return [];
  }
}

async function saveUsersData(data) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to save users data:', error);
    return false;
  }
}

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    let { username } = req.body;

    // Simplify: Only Email and Password required
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    // Auto-generate username from email if not provided
    if (!username) {
      username = email.split('@')[0] + '_' + Date.now().toString().slice(-4);
    }

    const users = await getUsersData();
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Check if auto-generated or provided username exists (unlikely if unique, but good to check)
    if (users.find(u => u.username === username)) {
      username = username + Math.floor(Math.random() * 1000);
    }

    const newUser = {
      id: Date.now(),
      username,
      email,
      password, // Note: In production, hash this password!
      name: name || username,
      role: 'user',
      membershipLevel: 'free',
      avatar: '/api/placeholder/40/40',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    if (await saveUsersData(users)) {
      const { password, ...userSafe } = newUser;
      res.status(201).json({ success: true, user: userSafe });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await getUsersData();

    // Login with username OR email
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);

    if (user) {
      const { password, ...userSafe } = user;
      res.json({ success: true, user: userSafe });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', async (req, res) => {
  // Basic implementation: Client sends ID in header (insecure for prod, ok for simple file-auth start)
  // Or we rely on client side storage for now as per "simple" request.
  // For better security, we'd use JWT tokens.
  // Let's stick to the minimal viable "enter with password" flow.
  res.status(501).json({ message: 'Session check implementation pending' });
});

// Original logic follows...
function isRateLimited(identifier) {
  if (!identifier) return false;
  const now = Date.now();
  const history = submissionTracker.get(identifier) || [];
  const recent = history.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) {
    submissionTracker.set(identifier, recent);
    return true;
  }
  recent.push(now);
  submissionTracker.set(identifier, recent);
  return false;
}

// 图片上传API
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '未选择文件' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: '图片上传成功',
      url: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('图片上传失败:', error);
    res.status(500).json({ error: '图片上传失败' });
  }
});

// 删除图片API
app.delete('/api/upload/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.access(filePath);
    await fs.unlink(filePath);
    res.json({ message: '图片删除成功' });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: '文件不存在' });
    } else {
      console.error('删除图片失败:', error);
      res.status(500).json({ error: '删除图片失败' });
    }
  }
});

// 获取所有文章（支持排序）
app.get('/api/articles', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const order = await getOrderData();

    let articleList = Object.values(articles);

    // 如果有自定义排序，按排序返回
    if (order.length > 0) {
      const ordered = [];
      const unordered = [...articleList];

      // 按排序顺序添加文章
      order.forEach(id => {
        const article = articleList.find(a => a.id === id);
        if (article) {
          ordered.push(article);
          const index = unordered.findIndex(a => a.id === id);
          if (index > -1) unordered.splice(index, 1);
        }
      });

      // 添加未排序的文章
      articleList = [...ordered, ...unordered];
    }

    res.json(articleList);
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 获取分类列表
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await getCategoriesData();
    res.json(categories);
  } catch (error) {
    console.error('获取分类失败:', error);
    res.status(500).json({ error: '获取分类失败' });
  }
});

// Payment Routes
app.post('/api/payment/create', async (req, res) => {
  try {
    const { subject, totalAmount, userId } = req.body;

    // In a real app, verify userId exists

    const bizContent = {
      out_trade_no: `${Date.now()}_${userId}`,
      product_code: 'FAST_INSTANT_TRADE_PAY',
      total_amount: totalAmount || '99.00',
      subject: subject || 'Membership Upgrade',
      body: `Upgrade for user ${userId}`,
    };

    // Use pageExec for page payment (alipay-sdk v4.x)
    // For GET method, pass parameters directly without AlipayFormData
    const result = await alipaySdk.pageExec('alipay.trade.page.pay', {
      method: 'GET',
      notify_url: 'https://bambumoon.cn/api/payment/notify',
      return_url: 'https://bambumoon.cn/membership?status=success',
      bizContent: bizContent,
    });

    // result is the payment URL
    res.json({ success: true, paymentUrl: result });
  } catch (error) {
    console.error('Payment creation failed:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

app.post('/api/payment/notify', (req, res) => {
  // Handle async notification from Alipay
  // Verify signature and update user membership status in users.json
  // For now, we acknowledge receipt
  console.log('Received payment notification:', req.body);
  res.send('success');
});

// Update User Membership (Dev/Test Helper)
app.post('/api/payment/mock-success', async (req, res) => {
  try {
    const { userId, level } = req.body;
    const users = await getUsersData();
    const userIndex = users.findIndex(u => u.id === userId || u.username === userId);

    if (userIndex !== -1) {
      users[userIndex].membershipLevel = level || 'pro';
      await saveUsersData(users);
      res.json({ success: true, user: users[userIndex] });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// 创建分类
app.post('/api/categories', async (req, res) => {
  try {
    const { name, color = '#64748b', description = '' } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: '分类名称不能为空' });
    }

    const categories = await getCategoriesData();
    const normalizedName = name.trim();

    const existingByName = categories.find(category => category.name === normalizedName);
    if (existingByName) {
      return res.status(409).json({ error: '已存在同名分类' });
    }

    const candidateId = slugify(normalizedName);
    const existingById = categories.find(category => category.id === candidateId);
    const finalId = existingById ? `${candidateId}-${Date.now()}` : candidateId;
    const nextOrder = categories.reduce((max, item) => Math.max(max, item.order || 0), 0) + 1;

    const newCategory = {
      id: finalId,
      name: normalizedName,
      color: color || '#64748b',
      description: description || '',
      order: nextOrder
    };

    categories.push(newCategory);
    const saved = await saveCategoriesData(categories);
    if (!saved) {
      return res.status(500).json({ error: '保存分类失败' });
    }

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({ error: '创建分类失败' });
  }
});

// 更新分类
app.put('/api/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, color, description, order } = req.body || {};

    const categories = await getCategoriesData();
    const index = categories.findIndex(category => category.id === categoryId);
    if (index === -1) {
      return res.status(404).json({ error: '分类不存在' });
    }

    if (name && name.trim()) {
      const normalizedName = name.trim();
      const existingByName = categories.find(
        category => category.name === normalizedName && category.id !== categoryId
      );
      if (existingByName) {
        return res.status(409).json({ error: '已存在同名分类' });
      }
      categories[index].name = normalizedName;
    }

    if (color) {
      categories[index].color = color;
    }

    if (typeof description === 'string') {
      categories[index].description = description;
    }

    const parsedOrder = Number(order);
    if (Number.isFinite(parsedOrder) && parsedOrder > 0) {
      categories[index].order = parsedOrder;
    }

    const saved = await saveCategoriesData(categories);
    if (!saved) {
      return res.status(500).json({ error: '保存分类失败' });
    }

    res.json(categories[index]);
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({ error: '更新分类失败' });
  }
});

// 删除分类
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categories = await getCategoriesData();
    const index = categories.findIndex(category => category.id === categoryId);
    if (index === -1) {
      return res.status(404).json({ error: '分类不存在' });
    }

    categories.splice(index, 1);
    const saved = await saveCategoriesData(categories);
    if (!saved) {
      return res.status(500).json({ error: '删除分类失败' });
    }

    res.json({ message: '分类已删除' });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({ error: '删除分类失败' });
  }
});

// 获取留言列表
app.get('/api/complaints', async (req, res) => {
  try {
    const { clientId = '' } = req.query;
    const complaints = await getComplaintsData();
    const list = complaints.filter(item => {
      if (item.status === 'approved') return true;
      if (item.status === 'pending' && clientId && item.clientId === clientId) {
        return true;
      }
      return false;
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    res.json(list);
  } catch (error) {
    console.error('获取留言失败:', error);
    res.status(500).json({ error: '获取留言失败' });
  }
});

// 提交留言
app.post('/api/complaints', async (req, res) => {
  try {
    const { content = '', mood = 'frustrated', requireApproval = true, clientId = '', tags = [] } = req.body || {};
    const validationError = validateComplaintContent(content);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const rateLimitId = clientId || req.ip;
    if (isRateLimited(rateLimitId)) {
      return res.status(429).json({ error: '提交太频繁，请稍后再试。' });
    }

    const complaints = await getComplaintsData();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComplaint = {
      id: Date.now().toString(),
      title: '',
      content: content.trim(),
      mood,
      author: requireApproval ? '我的匿名投稿（待审核）' : '我的匿名投稿',
      date: formattedDate,
      time: formattedTime,
      likes: 0,
      comments: 0,
      tags: Array.isArray(tags) ? tags : [],
      status: requireApproval ? 'pending' : 'approved',
      clientId: clientId || null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    complaints.push(newComplaint);
    const saved = await saveComplaintsData(complaints);
    if (!saved) {
      return res.status(500).json({ error: '保存留言失败' });
    }

    res.status(201).json(newComplaint);
  } catch (error) {
    console.error('提交留言失败:', error);
    res.status(500).json({ error: '提交留言失败' });
  }
});

// 获取单篇文章
app.get('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const article = articles[req.params.id];
    if (!article) {
      return res.status(404).json({ error: '文章不存在' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: '获取文章失败' });
  }
});

// 创建文章
app.post('/api/articles', async (req, res) => {
  try {
    const articles = await getArticlesData();
    const newArticle = {
      id: Date.now().toString(),
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      status: req.body.status || 'published'
    };

    articles[newArticle.id] = newArticle;
    const saved = await saveArticlesData(articles);

    if (saved) {
      res.status(201).json(newArticle);
    } else {
      res.status(500).json({ error: '保存文章失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '创建文章失败' });
  }
});

// 更新文章
app.put('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticlesData();
    if (!articles[req.params.id]) {
      return res.status(404).json({ error: '文章不存在' });
    }

    articles[req.params.id] = {
      ...articles[req.params.id],
      ...req.body
    };

    const saved = await saveArticlesData(articles);
    if (saved) {
      res.json(articles[req.params.id]);
    } else {
      res.status(500).json({ error: '更新文章失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '更新文章失败' });
  }
});

// 删除文章
app.delete('/api/articles/:id', async (req, res) => {
  try {
    const articles = await getArticlesData();
    if (!articles[req.params.id]) {
      return res.status(404).json({ error: '文章不存在' });
    }

    delete articles[req.params.id];
    const saved = await saveArticlesData(articles);

    // 同时从排序中移除
    const order = await getOrderData();
    const newOrder = order.filter(id => id !== req.params.id);
    await saveOrderData(newOrder);

    if (saved) {
      res.json({ message: '文章已删除' });
    } else {
      res.status(500).json({ error: '删除文章失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '删除文章失败' });
  }
});

// 更新文章排序
app.post('/api/articles/reorder', async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: '排序数据格式错误' });
    }

    const saved = await saveOrderData(order);
    if (saved) {
      res.json({ message: '排序已更新' });
    } else {
      res.status(500).json({ error: '更新排序失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '更新排序失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CMS API is running' });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小不能超过5MB' });
    }
  }
  console.error('Server error:', error);
  res.status(500).json({ error: error.message || '服务器内部错误' });
});

// 启动服务器
async function startServer() {
  await initDataFile();
  await initComplaintsFile();
  await initCategoryFile();
  await initUsersFile();
  await initializeUploadDir();
  app.listen(PORT, () => {
    console.log(`🚀 CMS API Server is running on port ${PORT}`);
    console.log(`📁 Upload directory: ${UPLOAD_DIR}`);
  });
}

startServer();
