'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { TechIcons } from '@/components/ui/TechIcons'
import { Code2, Server, Wrench } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

interface Skill {
  id: string
  name: string
  level: number
  category: string
  icon: string | null
  order: number
}

const SKILL_ICONS: Record<string, string> = {}

function SkillBar({ skill, index }: { skill: Skill; index: number }) {
  const { t } = useTranslations()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <motion.div
            animate={inView ? { rotate: 360, scale: 1 } : { rotate: 0, scale: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 + 0.2 }}
            className="w-5 h-5 flex-shrink-0"
          >
            {TechIcons[skill.icon || ''] ? (
              (() => {
                const Icon = TechIcons[skill.icon!]
                return <Icon size={20} />
              })()
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            )}
          </motion.div>
          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
            {skill.name}
          </span>
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
          {skill.level}%
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: 'var(--surface-2)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.5, delay: index * 0.05 + 0.3, ease: 'easeInOut' }}
          className="h-full rounded-full"
          style={{
            background: hovered
              ? 'linear-gradient(90deg, var(--accent), var(--accent-secondary, var(--accent)))'
              : 'var(--accent)',
            boxShadow: hovered ? 'var(--accent-glow)' : 'none',
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        />
      </div>

      {/* Tooltip */}
      {hovered && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs mt-1"
          style={{ color: 'var(--muted)' }}
        >
          {skill.level}% {t('proficiency')}
        </motion.p>
      )}
    </motion.div>
  )
}

interface SkillsSectionProps {
  skills: Skill[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const { t } = useTranslations()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const categories = [
    { key: 'frontend', labelKey: 'categoryFrontend' as const, Icon: Code2 },
    { key: 'backend', labelKey: 'categoryBackend' as const, Icon: Server },
    { key: 'tools', labelKey: 'categoryTools' as const, Icon: Wrench },
  ]

  return (
    <section id="skills" className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: 'var(--accent)' }}
          >
            {t('skillsKicker')}
          </span>
          <h2
            className="text-4xl md:text-5xl font-black mt-2"
            style={{ color: 'var(--foreground)' }}
          >
            {t('skillsTitleLead')}{' '}
            <span style={{ color: 'var(--accent)' }}>{t('skillsTitleAccent')}</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            {t('skillsSubtitle')}
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, catIndex) => {
            const catSkills = skills.filter((s) => s.category === cat.key)
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: catIndex * 0.15 }}
                className="p-6 rounded-2xl"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(var(--accent-rgb), 0.1)' }}
                  >
                    <cat.Icon size={18} style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                    {t(cat.labelKey)}
                  </h3>
                </div>

                <div className="flex flex-col gap-5">
                  {catSkills.map((skill, i) => (
                    <SkillBar key={skill.id} skill={skill} index={i} />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
