import { object, string, date } from 'yup'
import { parseDate } from '@/utils/validation'

// Validation schema
export const schema = object({
  administrationNo: string().required('Angabe ist erforderlich'),
  administrationDate: date().transform(parseDate).required('Angabe ist erforderlich'),
  label: string().required('Angabe ist erforderlich'),
  desc: string().required('Angabe ist erforderlich')
})
