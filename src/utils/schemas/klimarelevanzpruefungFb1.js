import { number, string, object } from 'yup'

// Validation schema
export const schema = object({
  a1q1: number().required('Das ist ein Pflichtfeld'),
  a1q2: string().when('a1q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a1q2'),
    otherwise: string().nullable(true)
  }),
  a1q3: number().when('a1q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('a1q3'),
    otherwise: number().nullable(true)
  }),
  a1q4: string().when('a1q3', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a1q4'),
    otherwise: string().nullable(true)
  }),
  a1q5: string().when('a1q3', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('a1q5'),
    otherwise: string().nullable(true)
  }),
  a2q1: number().required('Das ist ein Pflichtfeld'),
  a2q2: number().when('a2q1', {
    is: 1,
    then: number()
      .required('Das ist ein Pflichtfeld')
      .label('a2q2')
      .min(0, 'Muss mindestens 0 sein'),
    otherwise: number().nullable(true)
  }),
  a2q3: number().when('a2q2', {
    is: (val) => [3, 4].includes(val),
    then: number().required('Das ist ein Pflichtfeld').label('a2q3'),
    otherwise: number().nullable(true)
  }),
  a2q4: number().when('a2q3', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('a2q4'),
    otherwise: number().nullable(true)
  }),
  a2q5: string().when('a2q4', {
    is: (val) => typeof val === 'number',
    then: string().required('Das ist ein Pflichtfeld').label('a2q5'),
    otherwise: string().nullable(true)
  }),
  a2q6: number().when('a2q2', {
    is: (val) => [1, 2].includes(val),
    then: number().required('Das ist ein Pflichtfeld').label('a2q3'),
    otherwise: number().nullable(true)
  }),
  a2q7: string().when('a2q6', {
    is: (val) => typeof val === 'number',
    then: string().required('Das ist ein Pflichtfeld').label('a2q7'),
    otherwise: string().nullable(true)
  }),
  a2q8: number().when('a2q2', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('a2q8'),
    otherwise: number().nullable(true)
  }),
  a2q9: string().when('a2q8', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('a2q9'),
    otherwise: string().nullable(true)
  }),
  a2q10: number().when('a2q2', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('a2q10'),
    otherwise: number().nullable(true)
  }),
  a2q11: number().when('a2q10', {
    is: 2,
    then: number().required('Das ist ein Pflichtfeld').label('a2q12'),
    otherwise: number().nullable(true)
  }),
  a2q12: string().when('a2q2', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a2q12'),
    otherwise: string().nullable(true)
  }),
  a2q13: string().when('a2q12', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('a2q12'),
    otherwise: string().nullable(true)
  }),
  a2q14: number().when('a2q2', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('a2q12'),
    otherwise: number().nullable(true)
  }),
  a2q15: string().when('a2q14', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('a2q12'),
    otherwise: string().nullable(true)
  }),
  a3q1: number().required('Das ist ein Pflichtfeld'),
  a3q2: number().when('a3q1', {
    is: 1,
    then: number()
      .required('Das ist ein Pflichtfeld')
      .label('a3q2')
      .min(0, 'Muss mindestens 0 sein'),
    otherwise: number().nullable(true)
  }),
  a3q3: string().when('a3q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a2q3'),
    otherwise: string().nullable(true)
  }),
  a3q4: number().when('a3q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('a2q4'),
    otherwise: number().nullable(true)
  }),
  a3q5: string().when('a3q4', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a2q5'),
    otherwise: string().nullable(true)
  }),
  a3q6: string().when('a3q4', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('a2q3'),
    otherwise: string().nullable(true)
  }),
  a4q1: number().required('Das ist ein Pflichtfeld'),
  a4q2: number().when('a4q1', {
    is: 1,
    then: number()
      .required('Das ist ein Pflichtfeld')
      .label('a4q2')
      .min(0, 'Muss mindestens 0 sein'),
    otherwise: number().nullable(true)
  }),
  a4q3: string().when('a4q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a4q3'),
    otherwise: string().nullable(true)
  }),
  a4q4: number().when('a2q3', {
    is: (val) => !!val,
    then: number().required('Das ist ein Pflichtfeld').label('a3q4'),
    otherwise: number().nullable(true)
  }),
  a5q1: number().required('Das ist ein Pflichtfeld'),
  a5q2: string().when('a5q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a5q2'),
    otherwise: string().nullable(true)
  }),
  a5q3: string().when('a5q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a5q3'),
    otherwise: string().nullable(true)
  }),
  a5q4: number().when('a5q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('a2q4'),
    otherwise: number().nullable(true)
  }),
  a6q1: number().required('Das ist ein Pflichtfeld'),
  a6q2: string().when('a6q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a6q2'),
    otherwise: string().nullable(true)
  }),
  a6q3: number().when('a2q1', {
    is: 1,
    then: number().required('Das ist ein Pflichtfeld').label('a2q3'),
    otherwise: number().nullable(true)
  }),
  a6q4: string().when('a5q3', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a6q4'),
    otherwise: string().nullable(true)
  }),
  a6q5: string().when('a2q3', {
    is: 2,
    then: string().required('Das ist ein Pflichtfeld').label('a6q5'),
    otherwise: string().nullable(true)
  }),
  a7q1: number().required('Das ist ein Pflichtfeld'),
  a7q2: string().when('a7q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a7q2'),
    otherwise: string().nullable(true)
  }),
  a8q1: number().required('Das ist ein Pflichtfeld'),
  a8q2: string().when('a8q1', {
    is: 1,
    then: string().required('Das ist ein Pflichtfeld').label('a2q2'),
    otherwise: string().nullable(true)
  })
})
