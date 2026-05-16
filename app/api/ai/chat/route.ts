import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// ─── Rate limiting ────────────────────────────────────────────────────────────
const chatLimits = new Map<string, { count: number; resetAt: number }>()

function checkChatLimit(ip: string): { ok: boolean; remaining: number } {
  const MAX = 30
  const WINDOW = 60 * 60 * 1000 // 1 hour
  const now = Date.now()
  const rec = chatLimits.get(ip)

  if (!rec || now > rec.resetAt) {
    chatLimits.set(ip, { count: 1, resetAt: now + WINDOW })
    return { ok: true, remaining: MAX - 1 }
  }
  if (rec.count >= MAX) return { ok: false, remaining: 0 }
  rec.count++
  return { ok: true, remaining: MAX - rec.count }
}

// ─── Language detection ───────────────────────────────────────────────────────
type Lang = 'uz' | 'ru' | 'en'

function detectLang(text: string): Lang {
  const lower = text.toLowerCase()

  // Uzbek indicators
  const uzWords = ['salom', 'rahmat', 'nima', 'qanday', 'qachon', 'kim', 'qayer', 'iltimos',
    'yordam', 'loyiha', 'ko\'nikma', 'tajriba', 'narx', 'ish', 'dastur', 'veb', 'sayt',
    'men', 'sen', 'biz', 'bu', 'va', 'yoki', 'lekin', 'uchun', 'bilan', 'haqida',
    'qila', 'qiladi', 'qilaman', 'mumkin', 'kerak', 'bo\'ladi', 'ishlaydi']
  const uzCyrillic = /[ўқғҳ]/
  const uzLatin = /[oʻgʻ]|sh|ch|ng/

  // Russian indicators
  const ruCyrillic = /[а-яё]/i
  const ruWords = ['привет', 'здравствуй', 'спасибо', 'пожалуйста', 'как', 'что', 'где',
    'когда', 'кто', 'почему', 'проект', 'навык', 'опыт', 'цена', 'работа', 'сайт',
    'разработка', 'помощь', 'можно', 'нужно', 'есть', 'буду', 'делаю']

  let uzScore = 0
  let ruScore = 0
  let enScore = 0

  if (uzCyrillic.test(lower)) uzScore += 5
  if (uzLatin.test(lower)) uzScore += 2
  uzWords.forEach((w) => { if (lower.includes(w)) uzScore += 3 })

  if (ruCyrillic.test(lower)) ruScore += 3
  ruWords.forEach((w) => { if (lower.includes(w)) ruScore += 3 })

  // English — default if no CIS chars
  if (!/[а-яёўқғҳ]/i.test(lower)) enScore += 2
  const enWords = ['hello', 'hi', 'thanks', 'please', 'what', 'how', 'when', 'who', 'where',
    'project', 'skill', 'experience', 'price', 'work', 'website', 'help', 'can', 'need']
  enWords.forEach((w) => { if (lower.includes(w)) enScore += 2 })

  if (uzScore > ruScore && uzScore > enScore) return 'uz'
  if (ruScore > uzScore && ruScore > enScore) return 'ru'
  return 'en'
}

// ─── Portfolio context ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a smart AI assistant for Suhrobbek Baxtiyorov's portfolio website.

ABOUT SUHROBBEK:
- Full Stack Developer & UI/UX Designer, Tashkent, Uzbekistan
- 5+ years experience, 50+ projects completed, 30+ happy clients
- Available for freelance and full-time positions

TECHNICAL SKILLS:
Frontend: React (95%), Next.js (90%), TypeScript (85%), Tailwind CSS (90%), Three.js (70%), Framer Motion (80%)
Backend: Node.js (80%), Express (75%), PostgreSQL (70%), Prisma (75%), GraphQL (65%)
Tools: Git (95%), Docker (65%), Figma (80%), VS Code (99%)

EXPERIENCE:
- Senior Frontend Developer @ TechCorp Tashkent (2022–present)
- Junior Developer @ StartupXYZ (2020–2022)
- Freelance Web Developer (2019–2020)

PROJECTS: E-Commerce Platform, AI Chat App, Task Manager, Weather Dashboard, Portfolio v1

CONTACT: suhrobbek@portfolio.dev | github.com/suhrobbek | linkedin.com/in/suhrobbek | t.me/suhrobbek

RULES:
1. ALWAYS respond in the SAME language the user writes in (Uzbek → Uzbek, Russian → Russian, English → English)
2. Be friendly, professional, and concise (max 120 words)
3. For pricing questions: say to contact via email for a custom quote
4. Don't invent information not listed above
5. If asked about something unrelated to the portfolio, politely redirect
6. Use the user's name if they introduce themselves`

// ─── Rule-based responses (no API key) ───────────────────────────────────────
const RESPONSES = {
  uz: {
    greeting: "Salom! Men Suhrobbek Baxtiyorovning AI yordamchisiman 👋 Loyihalar, ko'nikmalar yoki hamkorlik haqida savollaringizga javob berishga tayyorman!",
    skills: "Suhrobbek quyidagi texnologiyalarda ishlaydi:\n\n🔹 Frontend: React (95%), Next.js (90%), TypeScript (85%), Tailwind CSS (90%)\n🔹 Backend: Node.js (80%), PostgreSQL (70%), Prisma (75%)\n🔹 Tools: Git (95%), Figma (80%), Docker (65%)\n\nBatafsil ma'lumot uchun Skills bo'limini ko'ring!",
    projects: "Suhrobbek 50+ loyiha yaratgan. Asosiy loyihalar:\n\n• E-Commerce Platform (React, Node.js, MongoDB)\n• AI Chat Application (Next.js, OpenAI)\n• Task Management App (Vue.js, Firebase)\n• Weather Dashboard (React, TypeScript)\n\nLoyihalar bo'limida batafsil ko'rishingiz mumkin!",
    contact: "Suhrobbek bilan bog'lanish:\n\n📧 suhrobbek@portfolio.dev\n💬 t.me/suhrobbek\n🔗 linkedin.com/in/suhrobbek\n\nYoki saytdagi Contact bo'limidan xabar yuboring!",
    price: "Narxlar loyiha hajmi va murakkabligiga qarab belgilanadi. Aniq narx olish uchun:\n\n📧 suhrobbek@portfolio.dev\n\nLoyihangiz haqida yozing, 24 soat ichida javob beriladi!",
    experience: "Suhrobbek 5+ yillik tajribaga ega:\n\n🏢 Senior Frontend Developer @ TechCorp Tashkent (2022–hozir)\n🏢 Junior Developer @ StartupXYZ (2020–2022)\n💻 Freelance Web Developer (2019–2020)\n\nJami 50+ loyiha, 30+ mamnun mijoz!",
    available: "Ha, Suhrobbek hozir yangi loyihalar uchun ochiq! 🟢\n\nFreelance va full-time takliflarga ko'rib chiqadi.\n\n📧 suhrobbek@portfolio.dev ga yozing!",
    location: "Suhrobbek Toshkent, O'zbekistonda joylashgan 📍\n\nLekin remote ham ishlaydi — dunyo bo'ylab mijozlar bilan hamkorlik qiladi!",
    default: "Savolingiz uchun rahmat! Men Suhrobbek Baxtiyorovning AI yordamchisiman.\n\nQuyidagi mavzularda yordam bera olaman:\n• Ko'nikmalar va texnologiyalar\n• Loyihalar haqida ma'lumot\n• Narxlar va hamkorlik\n• Bog'lanish ma'lumotlari\n\nNima haqida bilmoqchisiz?",
  },
  ru: {
    greeting: "Привет! Я AI-ассистент портфолио Сухроббека Бахтиёрова 👋 Готов ответить на вопросы о проектах, навыках или сотрудничестве!",
    skills: "Технические навыки Сухроббека:\n\n🔹 Frontend: React (95%), Next.js (90%), TypeScript (85%), Tailwind CSS (90%)\n🔹 Backend: Node.js (80%), PostgreSQL (70%), Prisma (75%)\n🔹 Инструменты: Git (95%), Figma (80%), Docker (65%)\n\nПодробнее в разделе Skills!",
    projects: "Сухроббек создал 50+ проектов. Основные:\n\n• E-Commerce Platform (React, Node.js, MongoDB)\n• AI Chat Application (Next.js, OpenAI)\n• Task Management App (Vue.js, Firebase)\n• Weather Dashboard (React, TypeScript)\n\nСмотрите раздел Projects для деталей!",
    contact: "Связаться с Сухроббеком:\n\n📧 suhrobbek@portfolio.dev\n💬 t.me/suhrobbek\n🔗 linkedin.com/in/suhrobbek\n\nИли через форму Contact на сайте!",
    price: "Стоимость зависит от объёма и сложности проекта. Для точной оценки:\n\n📧 suhrobbek@portfolio.dev\n\nОпишите ваш проект — ответ в течение 24 часов!",
    experience: "Опыт Сухроббека — 5+ лет:\n\n🏢 Senior Frontend Developer @ TechCorp Tashkent (2022–н.в.)\n🏢 Junior Developer @ StartupXYZ (2020–2022)\n💻 Freelance Web Developer (2019–2020)\n\n50+ проектов, 30+ довольных клиентов!",
    available: "Да, Сухроббек открыт для новых проектов! 🟢\n\nРассматривает freelance и full-time предложения.\n\n📧 Пишите: suhrobbek@portfolio.dev",
    location: "Сухроббек находится в Ташкенте, Узбекистан 📍\n\nНо работает удалённо — сотрудничает с клиентами по всему миру!",
    default: "Спасибо за вопрос! Я AI-ассистент портфолио Сухроббека.\n\nМогу помочь с:\n• Информацией о навыках\n• Описанием проектов\n• Ценами и сотрудничеством\n• Контактными данными\n\nЧто вас интересует?",
  },
  en: {
    greeting: "Hi there! I'm the AI assistant for Suhrobbek Baxtiyorov's portfolio 👋 I can answer questions about his skills, projects, or how to work together!",
    skills: "Suhrobbek's technical skills:\n\n🔹 Frontend: React (95%), Next.js (90%), TypeScript (85%), Tailwind CSS (90%)\n🔹 Backend: Node.js (80%), PostgreSQL (70%), Prisma (75%)\n🔹 Tools: Git (95%), Figma (80%), Docker (65%)\n\nCheck the Skills section for the full list!",
    projects: "Suhrobbek has built 50+ projects. Key ones:\n\n• E-Commerce Platform (React, Node.js, MongoDB)\n• AI Chat Application (Next.js, OpenAI)\n• Task Management App (Vue.js, Firebase)\n• Weather Dashboard (React, TypeScript)\n\nSee the Projects section for details!",
    contact: "Get in touch with Suhrobbek:\n\n📧 suhrobbek@portfolio.dev\n💬 t.me/suhrobbek\n🔗 linkedin.com/in/suhrobbek\n\nOr use the Contact form on this site!",
    price: "Pricing depends on project scope and complexity. For a custom quote:\n\n📧 suhrobbek@portfolio.dev\n\nDescribe your project and get a response within 24 hours!",
    experience: "Suhrobbek has 5+ years of experience:\n\n🏢 Senior Frontend Developer @ TechCorp Tashkent (2022–present)\n🏢 Junior Developer @ StartupXYZ (2020–2022)\n💻 Freelance Web Developer (2019–2020)\n\n50+ projects, 30+ happy clients!",
    available: "Yes, Suhrobbek is open to new projects! 🟢\n\nConsidering both freelance and full-time opportunities.\n\n📧 Reach out: suhrobbek@portfolio.dev",
    location: "Suhrobbek is based in Tashkent, Uzbekistan 📍\n\nBut works remotely — collaborating with clients worldwide!",
    default: "Thanks for your question! I'm Suhrobbek's AI assistant.\n\nI can help with:\n• Skills & technologies\n• Project information\n• Pricing & collaboration\n• Contact details\n\nWhat would you like to know?",
  },
}

function getRuleBasedResponse(message: string, lang: Lang): string {
  const msg = message.toLowerCase()

  const patterns = {
    greeting: ['salom', 'hello', 'hi', 'hey', 'привет', 'здравствуй', 'хай', 'assalomu', 'good morning', 'good day'],
    skills: ['skill', 'ko\'nikma', 'texnolog', 'bilim', 'навык', 'технолог', 'умеет', 'знает', 'react', 'next', 'typescript', 'node', 'stack'],
    projects: ['project', 'loyiha', 'проект', 'работа', 'ish', 'portfolio', 'built', 'created', 'yaratgan'],
    contact: ['contact', 'aloqa', 'контакт', 'связь', 'email', 'telegram', 'linkedin', 'bog\'lan', 'reach', 'write'],
    price: ['price', 'narx', 'цена', 'стоимость', 'cost', 'how much', 'qancha', 'сколько', 'budget', 'rate', 'fee'],
    experience: ['experience', 'tajriba', 'опыт', 'worked', 'ishlagan', 'career', 'history', 'background', 'years'],
    available: ['available', 'bo\'sh', 'свободен', 'hire', 'freelance', 'job', 'work', 'ish', 'vacancy', 'position'],
    location: ['location', 'joylashuv', 'местонахождение', 'where', 'qayerda', 'где', 'city', 'country', 'tashkent'],
  }

  for (const [key, words] of Object.entries(patterns)) {
    if (words.some((w) => msg.includes(w))) {
      return RESPONSES[lang][key as keyof typeof RESPONSES['en']]
    }
  }

  return RESPONSES[lang].default
}

// ─── Main handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const limit = checkChatLimit(ip)
    if (!limit.ok) {
      return NextResponse.json(
        {
          reply: {
            uz: "Juda ko'p xabar yubordingiz. Iltimos, 1 soatdan keyin qayta urinib ko'ring.",
            ru: "Слишком много сообщений. Попробуйте снова через 1 час.",
            en: "Too many messages. Please try again in 1 hour.",
          }['en'],
          lang: 'en',
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { message, sessionId } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    if (message.trim().length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 chars)' }, { status: 400 })
    }

    const lang = detectLang(message)
    const apiKey = process.env.OPENAI_API_KEY

    // No API key — use smart rule-based
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      const reply = getRuleBasedResponse(message, lang)
      return NextResponse.json({ reply, lang, sessionId })
    }

    // OpenAI
    try {
      const { default: OpenAI } = await import('openai')
      const openai = new OpenAI({ apiKey })

      const sid = sessionId || `session_${Date.now()}`

      // Get recent history
      const history = await prisma.chatMessage.findMany({
        where: { sessionId: sid },
        orderBy: { createdAt: 'asc' },
        take: 8,
      })

      const langInstruction = lang === 'uz'
        ? 'The user is writing in Uzbek. Respond ONLY in Uzbek.'
        : lang === 'ru'
        ? 'The user is writing in Russian. Respond ONLY in Russian.'
        : 'The user is writing in English. Respond ONLY in English.'

      const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\nLANGUAGE RULE: ${langInstruction}` },
        ...history.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: message.trim() },
      ]

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 250,
        temperature: 0.75,
      })

      const reply = completion.choices[0]?.message?.content?.trim() ||
        getRuleBasedResponse(message, lang)

      // Save to DB
      await prisma.chatMessage.createMany({
        data: [
          { role: 'user', content: message.trim(), sessionId: sid },
          { role: 'assistant', content: reply, sessionId: sid },
        ],
      })

      return NextResponse.json({ reply, lang, sessionId: sid })
    } catch (aiError) {
      console.error('OpenAI error:', aiError)
      // Fallback to rule-based
      const reply = getRuleBasedResponse(message, lang)
      return NextResponse.json({ reply, lang, sessionId })
    }
  } catch (error) {
    console.error('Chat route error:', error)
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble right now. Please try again.", lang: 'en' },
      { status: 200 }
    )
  }
}
