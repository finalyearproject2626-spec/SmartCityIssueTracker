/** Display labels for API enum values (English stored in DB). */
const STATUS_TA = {
  Pending: 'நிலுவையில்',
  'In Progress': 'செயல்பாட்டில்',
  Rejected: 'நிராகரிக்கப்பட்டது',
  Resolved: 'தீர்க்கப்பட்டது'
}

const CATEGORY_TA = {
  Road: 'சாலை',
  Water: 'தண்ணீர்',
  Electricity: 'மின்சாரம்',
  Waste: 'கழிவு',
  Drainage: 'வடிகால்',
  'Street Light': 'தெருவிளக்கு',
  Other: 'மற்றவை'
}

export function complaintStatusLabel(language, status) {
  if (!status) return ''
  if (language === 'tamil' && STATUS_TA[status]) return STATUS_TA[status]
  return status
}

export function complaintCategoryLabel(language, category) {
  if (!category) return ''
  if (language === 'tamil' && CATEGORY_TA[category]) return CATEGORY_TA[category]
  return category
}
