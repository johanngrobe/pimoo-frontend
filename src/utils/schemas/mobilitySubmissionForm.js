import * as yup from 'yup'

// Validation schema
export const schema = yup.object({
  // author: yup.string().required('Angabe ist erforderlich'),
  administrationNo: yup.string().required('Angabe ist erforderlich'),
  administrationDate: yup.date().required('Angabe ist erforderlich'),
  label: yup.string().required('Angabe ist erforderlich'),
  desc: yup.string().required('Angabe ist erforderlich')
})
