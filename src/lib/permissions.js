/**
 * UI permission helper
 * IMPORTANT: the server is the real authority — this only drives UI visibility.
 */
export const can = (user, action, lead, settings = {}) => {
  if (!user) return false
  if (user.role === 'admin') return true

  const mine =
    lead &&
    (lead.createdBy?._id === user._id || lead.assignedTo?._id === user._id)

  switch (action) {
    case 'lead.edit':
    case 'lead.status':
    case 'lead.assign':
    case 'lead.labels':
    case 'lead.rating':
    case 'followup.add':
      return !!mine

    case 'lead.delete':
      return !!(settings.staffCanDeleteOwnLead && lead?.createdBy?._id === user._id)

    case 'followup.edit':
    case 'followup.delete':
      return lead?.__followup?.createdBy === user._id

    case 'lead.restore':
    case 'users.manage':
    case 'masters.manage':
    case 'settings.manage':
    case 'import':
      return false // admin only

    default:
      return false
  }
}

export const isAdmin = (user) => user?.role === 'admin'
export const isStaff = (user) => user?.role === 'staff'
