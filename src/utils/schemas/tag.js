import * as yup from 'yup'

// Validation schema
export const schema = yup.object({
  label: yup.string().required('Angabe ist erforderlich')
})
