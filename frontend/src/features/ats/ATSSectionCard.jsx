import {motion as Motion } from 'framer-Motion'

const SECTION_LABELS = {
  structure:            'Structure',
  readability:          'Readability',
  grammar:              'Grammar',
  professionalLanguage: 'Professional Language',
  skillsSection:        'Skills Section',
  projectsSection:      'Projects Section',
  experienceSection:    'Experience Section',
  educationSection:     'Education Section',
  formatting:           'Formatting',
  actionVerbs:          'Action Verbs',
  bulletImpact:         'Bullet Impact',
  keywordOptimization:  'Keyword Optimization',
  missingInfo:          'Missing Info',
  overallQuality:       'Overall Quality',
}

const getBarColor = (score) => {
  if (score >= 8) return 'var(--color-success)'
  if (score >= 6) return 'var(--color-warning)'
  if (score >= 4) return 'var(--color-primary)'
  return 'var(--color-danger)'
}

const ATSSectionCard = ({ sectionKey, data, index }) => {
  const { score, feedback } = data
  const color = getBarColor(score)

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="p-4 rounded-2xl flex flex-col gap-3"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-semibold"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {SECTION_LABELS[sectionKey] ?? sectionKey}
        </span>
        <span
          className="text-sm font-bold shrink-0"
          style={{ color }}
        >
          {score}/10
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--color-border)' }}
      >
        <Motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.7, delay: index * 0.04 + 0.2, ease: 'easeOut' }}
        />
      </div>

      {/* Feedback */}
      <p
        className="text-xs leading-relaxed"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {feedback}
      </p>
    </Motion.div>
  )
}

export default ATSSectionCard