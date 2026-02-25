export const ICON_CATEGORIES = [
  {
    label: 'Health',
    icons: ['💪', '🏃', '🚴', '🧘', '🏊', '🤸', '🏋️', '❤️'],
  },
  {
    label: 'Hygiene',
    icons: ['🦷', '🚿', '🧼', '💊', '😴', '🛏️'],
  },
  {
    label: 'Food & Drink',
    icons: ['💧', '🥗', '🍎', '☕', '🥤', '🥦', '🍳', '🫖'],
  },
  {
    label: 'Mind',
    icons: ['📚', '📝', '🧠', '🎯', '💡', '🔬', '🧩'],
  },
  {
    label: 'Lifestyle',
    icons: ['🌅', '🌙', '🌿', '😊', '🧹', '🌳', '🐕', '🌸'],
  },
  {
    label: 'Hobbies',
    icons: ['🎵', '🎨', '📷', '🌱', '🎮', '✏️', '🎸'],
  },
  {
    label: 'Work',
    icons: ['💼', '📧', '✅', '🔔', '📊', '💰'],
  },
]

export const ALL_ICONS = ICON_CATEGORIES.flatMap(cat => cat.icons)
