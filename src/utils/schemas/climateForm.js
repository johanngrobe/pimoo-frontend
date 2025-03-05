import * as yup from 'yup'

// Define your enums
const impactEnum = ['positive', 'negative', 'no_effect']
const impactDurationEnum = ['short', 'medium', 'long']

// Validation schema
export const schema = yup.object({
  // author: yup.string().required('Angabe ist erforderlich'),
  administrationNo: yup.string().required('Angabe ist erforderlich'),
  administrationDate: yup.date().required('Angabe ist erforderlich'),
  label: yup.string().required('Angabe ist erforderlich'),
  impact: yup
    .string()
    .oneOf(impactEnum, 'Ungültiger Wert für Impact')
    .required('Angabe ist erforderlich'),
  impactGhg: yup.number().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) =>
      schema
        .integer('ImpactGhg muss eine ganze Zahl sein')
        .notOneOf([0], 'ImpactGhg darf nicht 0 sein')
        .min(-2, 'ImpactGhg muss zwischen -2 und 2 liegen')
        .max(2, 'ImpactGhg muss zwischen -2 und 2 liegen')
        .required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  impactAdaption: yup.number().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) =>
      schema
        .integer('ImpactAdaption muss eine ganze Zahl sein')
        .notOneOf([0], 'ImpactAdaption darf nicht 0 sein')
        .min(-2, 'ImpactAdaption muss zwischen -2 und 2 liegen')
        .max(2, 'ImpactAdaption muss zwischen -2 und 2 liegen')
        .required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  impactDesc: yup.string().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) => schema.required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  impactDuration: yup.string().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) =>
      schema
        .oneOf(impactDurationEnum, 'Ungültiger Wert für Impact Duration')
        .required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  alternativeDesc: yup.string().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) => schema.required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  })
})
