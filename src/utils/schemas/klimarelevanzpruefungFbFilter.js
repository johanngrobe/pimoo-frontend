import { boolean, object } from 'yup'

// Validation schema
export const schema = object({
  fb1: boolean().nullable(true),
  fb2: boolean().nullable(true),
  fb3: boolean().nullable(true),
  fb4: boolean().nullable(true),
  fb5: boolean().nullable(true)
})
