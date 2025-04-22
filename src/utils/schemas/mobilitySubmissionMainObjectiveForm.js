import * as yup from 'yup'

// Validation schema
export const schema = yup.object({
  submissionId: yup.number().required('Angabe ist erforderlich'),
  mainObjectiveId: yup.number().required('Angabe ist erforderlich'),
  target: yup.boolean().default(false)
})
