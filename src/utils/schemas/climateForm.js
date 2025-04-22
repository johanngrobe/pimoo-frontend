import { object, date, string, number } from 'yup'
import { parseDate } from '@/utils/validation'

// Define your enums
const impactEnum = ['positive', 'negative', 'no_effect']
const impactDurationEnum = ['short', 'medium', 'long']

// Validation schema
export const schema = object({
  // author: yup.string().required('Angabe ist erforderlich'),
  administrationNo: string().required('Angabe ist erforderlich'),
  administrationDate: date().transform(parseDate).required('Angabe ist erforderlich'),
  label: string().required('Angabe ist erforderlich'),
  impact: string()
    .oneOf(impactEnum, 'Ungültiger Wert für Impact')
    .required('Angabe ist erforderlich'),
  impactGhg: number().when('impact', {
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
  impactAdaption: number().when('impact', {
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
  impactDesc: string().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) => schema.required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  impactDuration: string().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) =>
      schema
        .oneOf(impactDurationEnum, 'Ungültiger Wert für Impact Duration')
        .required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  }),
  alternativeDesc: string().when('impact', {
    is: (impact) => impact !== 'no_effect',
    then: (schema) => schema.required('Bitte ausfüllen, wenn Impact nicht "no_effect" ist'),
    otherwise: (schema) => schema.optional().nullable(true).oneOf([null, ''])
  })
})
