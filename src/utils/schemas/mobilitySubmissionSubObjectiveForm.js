import * as yup from 'yup'

// Validation schema
export const schema = yup.object({
  mobilityResultId: yup.number().required('Angabe ist erforderlich'),
  subObjectiveId: yup.number().required('Angabe ist erforderlich'),
  target: yup.boolean().default(false),
  impact: yup.number().min(-3).max(3).nullable(true),
  spatial_impact: yup.string().nullable(true),
  annotation: yup.string().nullable(true),
  indicatorIds: yup.array().of(yup.number()).nullable(true)
})
