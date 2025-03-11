import * as yup from 'yup'

// Validation schema
export const schema = yup.object({
  // author: yup.string().required('Angabe ist erforderlich'),
  no: yup.number().required('Angabe ist erforderlich'),
  label: yup.string().required('Angabe ist erforderlich')
})
