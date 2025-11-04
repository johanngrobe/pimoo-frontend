import { number, string, object } from 'yup'

// Validation schema
export const schema = object({
  b1q1: number().required('Das ist ein Pflichtfeld'),
  b1q2: number().when('b1q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('b1q2'),
    otherwise: number().nullable(true)
  }),
  b1q3: string().when('b1q2', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('b1q3'),
    otherwise: string().nullable(true)
  }),
  b1q4: number().when('b1q3', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('b1q4'),
    otherwise: number().nullable(true)
  }),
  b1q5: string().when('b1q4', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('b1q5'),
    otherwise: string().nullable(true)
  }),
  b1q6: number().when('b1q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('b1q5'),
    otherwise: string().nullable(true)
  }),
  b1q7: string().when('b1q6', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('b1q7'),
    otherwise: string().nullable(true)
  }),
  b1q8: number().when('b1q6', {
    is: 2,
    then: number().required('Das ist ein Pflichtfeld').label('b1q8'),
    otherwise: number().nullable(true)
  }),
  b1q9: number().when('b1q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('b1q9'),
    otherwise: number().nullable(true)
  }),
  b1q10: string().when('b1q9', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('b1q9'),
    otherwise: string().nullable(true)
  }),
  b1q11: string().when('b1q9', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('b1q11'),
    otherwise: string().nullable(true)
  }),
  b1q12: number().when('b1q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('b1q12'),
    otherwise: number().nullable(true)
  }),
  b1q13: string().when('b1q12', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('b1q13'),
    otherwise: string().nullable(true)
  }),
  b1q14: string().when('b1q12', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('b1q14'),
    otherwise: string().nullable(true)
  }),
  b1q15: number().when('b1q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('b1q15'),
    otherwise: number().nullable(true)
  }),
  b1q16: string().when('b1q15', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('b1q16'),
    otherwise: string().nullable(true)
  }),
  b1q17: string().when('b1q15', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('b1q17'),
    otherwise: string().nullable(true)
  }),
  b1q18: number().when('b1q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('b1q18'),
    otherwise: number().nullable(true)
  }),
  b1q19: string().when('b1q18', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('b1q13'),
    otherwise: string().nullable(true)
  }),
  b1q20: string().when('b1q18', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('b1q20'),
    otherwise: string().nullable(true)
  }),
  b2q1: number().required('Das ist ein Pflichtfeld'),
  b2q2: string().when('b2q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('b2q2'),
    otherwise: string().nullable(true)
  }),
  b2q3: string().when('b2q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('b1q3'),
    otherwise: string().nullable(true)
  }),
  b2q4: number().when('b2q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('b1q4'),
    otherwise: number().nullable(true)
  }),
  b2q5: string().when('b2q4', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('b1q5'),
    otherwise: string().nullable(true)
  })
})
