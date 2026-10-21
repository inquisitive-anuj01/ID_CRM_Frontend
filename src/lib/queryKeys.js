export const qk = {
  me: ['me'],
  users: {
    options: ['users', 'options'],
    list: (p) => ['users', 'list', p],
  },
  masters: {
    statuses: ['statuses'],
    sources: ['sources'],
    labels: ['labels'],
    categories: ['categories'],
  },
  settings: ['settings'],
  leads: {
    list:     (p) => ['leads', 'list', p],
    board:    (p) => ['leads', 'board', p],
    one:      (id) => ['lead', id],
    followups: (id) => ['followups', id],
    history:  (id) => ['history', id],
    duplicate: (mobile) => ['leads', 'duplicate', mobile],
  },
  followups: {
    mine: (p) => ['followups', 'mine', p],
  },
  dashboard: {
    summary: (p) => ['dashboard', 'summary', p],
    leads:   (s, p) => ['dashboard', 'leads', s, p],
  },
  reports: (name, p) => ['reports', name, p],
  notifications: ['notifications'],
}
