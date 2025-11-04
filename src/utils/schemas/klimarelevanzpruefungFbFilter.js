import { boolean, string, object } from 'yup'

// Validation schema
export const schema = object({
  name: string().required('Name ist erforderlich').label('Name'),
  fb1: boolean().nullable(true),
  fb2: boolean().nullable(true),
  fb3: boolean().nullable(true),
  fb4: boolean().nullable(true),
  fb5: boolean()
    .nullable(true)
    .test('at-least-one-true', 'Mindestens ein Feld muss ausgewählt werden', function () {
      const { fb1, fb2, fb3, fb4, fb5 } = this.parent
      return [fb1, fb2, fb3, fb4, fb5].some((v) => v === true)
    })
})
