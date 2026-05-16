// Content moderation — silent operation, no traces in UI
// This module is intentionally minimal and undocumented

const BAD_WORDS_UZ = [
  'ahmoq','tentak','eshak','it','kalta','nodon','bema\'ni',
  'yaramas','beadab','harom','la\'nat','qarg\'ish','murdor',
]

const BAD_WORDS_RU = [
  'дурак','идиот','тупой','урод','сволочь','придурок',
  'мразь','ублюдок','скотина','тварь',
]

const BAD_WORDS_EN = [
  'stupid','idiot','moron','dumb','loser','trash','scum',
  'bastard','jerk','fool',
]

// Explicit words — full block
const EXPLICIT_PATTERNS = [
  /f+u+c+k+/i, /s+h+i+t+/i, /b+i+t+c+h+/i, /a+s+s+h+o+l+e+/i,
  /c+u+n+t+/i, /d+i+c+k+/i, /p+u+s+s+y+/i, /n+i+g+g+/i,
  /хуй/i, /пизд/i, /ёбан/i, /блять/i, /сука/i, /пидор/i,
  /мудак/i, /ублюдок/i, /залупа/i,
  /сикинг/i, /сикин/i, /оросп/i, /амак/i,
]

export interface FilterResult {
  clean: boolean
  filtered: string
  severity: 'none' | 'mild' | 'severe'
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function filterContent(text: string): FilterResult {
  if (!text || text.trim().length === 0) {
    return { clean: true, filtered: text, severity: 'none' }
  }

  let filtered = text
  let severity: FilterResult['severity'] = 'none'

  // Check explicit patterns — severe
  for (const pattern of EXPLICIT_PATTERNS) {
    if (pattern.test(filtered)) {
      severity = 'severe'
      filtered = filtered.replace(pattern, (match) => '*'.repeat(match.length))
    }
  }

  // Check word lists — mild
  const allBadWords = [...BAD_WORDS_UZ, ...BAD_WORDS_RU, ...BAD_WORDS_EN]
  for (const word of allBadWords) {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'gi')
    if (regex.test(filtered)) {
      if (severity === 'none') severity = 'mild'
      filtered = filtered.replace(regex, (match) => match[0] + '*'.repeat(match.length - 1))
    }
  }

  return {
    clean: severity === 'none',
    filtered,
    severity,
  }
}

export function shouldBlock(text: string): boolean {
  const result = filterContent(text)
  return result.severity === 'severe'
}
