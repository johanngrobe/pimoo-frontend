import * as yup from 'yup'

// Validation schema
export const schema = yup.object({
  no: yup.number().required('Angabe ist erforderlich'),
  label: yup.string().required('Angabe ist erforderlich'),
  mainObjectiveId: yup.number().required('Angabe ist erforderlich')
})
