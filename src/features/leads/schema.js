import { z } from 'zod'

export const leadSchema = z.object({
  name: z.string().min(1, 'Lead name is required'),
  mobile: z.string().min(7, 'Valid contact number is required'),
  countryCode: z.string().default('+91'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  company: z.string().optional(),
  service: z.string().optional(),
  source: z.string().optional(),
  status: z.string().optional(),
  estimateAmount: z.coerce.number().min(0).optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  notes: z.string().optional(),
  labels: z.array(z.string()).optional(),
  assignedTo: z.string().optional(),
})
