// Custom SVG Tech Icons — no emojis

export const TechIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  react: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="2.5" fill="#61DAFB"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" strokeWidth="1.2" fill="none" transform="rotate(120 12 12)"/>
    </svg>
  ),
  nextjs: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.5 14.5L8 9v7H6.5V7h1.75l7 9.5H13.5V9H15v7.5h.5z"/>
    </svg>
  ),
  typescript: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="#3178C6"/>
      <path d="M14.5 11.5H17v1.5h-2.5V17H13v-4H10.5v-1.5H14.5z" fill="white"/>
      <path d="M8 11.5v1.5h2V17h1.5v-4h2v-1.5H8z" fill="white"/>
    </svg>
  ),
  tailwind: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 6C9.6 6 8.1 7.2 7.5 9.6c.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.715 1.219C13.24 10.39 14.177 11.4 16.5 11.4c2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.171-1.174-.668-1.715-1.219C15.26 7.01 14.323 6 12 6zM7.5 11.4C5.1 11.4 3.6 12.6 3 15c.9-1.2 1.95-1.65 3.15-1.35.685.171 1.174.668 1.715 1.219C8.74 15.79 9.677 16.8 12 16.8c2.4 0 3.9-1.2 4.5-3.6-.9 1.2-1.95 1.65-3.15 1.35-.685-.171-1.174-.668-1.715-1.219C10.76 12.41 9.823 11.4 7.5 11.4z" fill="#38BDF8"/>
    </svg>
  ),
  nodejs: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" stroke="#68A063" strokeWidth="1.5" fill="none"/>
      <path d="M12 2v20M3 7l9 5 9-5" stroke="#68A063" strokeWidth="1.5"/>
    </svg>
  ),
  git: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="6" r="2" fill="#F05032"/>
      <circle cx="18" cy="6" r="2" fill="#F05032"/>
      <circle cx="6" cy="18" r="2" fill="#F05032"/>
      <path d="M8 6h8M6 8v8" stroke="#F05032" strokeWidth="1.5"/>
      <path d="M8 18h4a4 4 0 004-4V8" stroke="#F05032" strokeWidth="1.5"/>
    </svg>
  ),
  docker: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="10" width="20" height="8" rx="2" stroke="#2496ED" strokeWidth="1.5"/>
      <rect x="4" y="7" width="4" height="3" stroke="#2496ED" strokeWidth="1.2"/>
      <rect x="9" y="7" width="4" height="3" stroke="#2496ED" strokeWidth="1.2"/>
      <rect x="14" y="7" width="4" height="3" stroke="#2496ED" strokeWidth="1.2"/>
      <rect x="9" y="4" width="4" height="3" stroke="#2496ED" strokeWidth="1.2"/>
      <path d="M20 14c1.5 0 2.5-1 2.5-2.5" stroke="#2496ED" strokeWidth="1.2"/>
    </svg>
  ),
  figma: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="8" y="2" width="8" height="6" rx="3" fill="#F24E1E"/>
      <rect x="8" y="9" width="8" height="6" rx="3" fill="#A259FF"/>
      <rect x="8" y="16" width="8" height="6" rx="3" fill="#0ACF83"/>
      <circle cx="16" cy="12" r="3" fill="#1ABCFE"/>
    </svg>
  ),
  postgresql: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="6" rx="8" ry="3" stroke="#336791" strokeWidth="1.5"/>
      <path d="M4 6v12c0 1.657 3.582 3 8 3s8-1.343 8-3V6" stroke="#336791" strokeWidth="1.5"/>
      <path d="M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3" stroke="#336791" strokeWidth="1.5"/>
    </svg>
  ),
  prisma: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 20L12 3l9 17H3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M3 20l9-6 9 6" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  graphql: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="3" r="2" fill="#E535AB"/>
      <circle cx="21" cy="8" r="2" fill="#E535AB"/>
      <circle cx="21" cy="16" r="2" fill="#E535AB"/>
      <circle cx="12" cy="21" r="2" fill="#E535AB"/>
      <circle cx="3" cy="16" r="2" fill="#E535AB"/>
      <circle cx="3" cy="8" r="2" fill="#E535AB"/>
      <circle cx="12" cy="12" r="2" fill="#E535AB"/>
      <path d="M12 5L21 10M21 14L12 19M12 19L3 14M3 10L12 5M3 10L3 14M21 10L21 14M12 5L12 19" stroke="#E535AB" strokeWidth="1"/>
    </svg>
  ),
  vscode: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M17 2L7 12.5 3 9l-1 1 4.5 4.5L2 18l1 1 4-2.5L17 22l5-2.5V4.5L17 2z" fill="#007ACC"/>
      <path d="M17 2L7 12.5l10 7.5V2z" fill="#1BA1E2" opacity="0.5"/>
    </svg>
  ),
  threejs: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 3L22 19H2L12 3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M7 19L12 11l5 8" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
      <path d="M9.5 15h5" stroke="currentColor" strokeWidth="1.2" opacity="0.6"/>
    </svg>
  ),
  framer: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 3h14v7H5V3zM5 10h7l7 7H5v-7zM5 17h7v7L5 17z" fill="currentColor" opacity="0.8"/>
    </svg>
  ),
  express: ({ size = 24, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 8h18M3 12h12M3 16h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
}

// Floating icons for hero section
export const HeroFloatingIcons = [
  { id: 'react', Icon: TechIcons.react },
  { id: 'nextjs', Icon: TechIcons.nextjs },
  { id: 'typescript', Icon: TechIcons.typescript },
  { id: 'tailwind', Icon: TechIcons.tailwind },
  { id: 'nodejs', Icon: TechIcons.nodejs },
  { id: 'git', Icon: TechIcons.git },
]
