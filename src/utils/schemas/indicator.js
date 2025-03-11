import * as yup from 'yup'

// Validation schema
export const schema = yup.object({
  label: yup.string().required('Angabe ist erforderlich'),
  sourceUrl: yup.string().url('Ungültige URL').nullable(true),
  tagIds: yup.array().of(yup.number()).nullable(true)
})
