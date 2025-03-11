import * as yup from 'yup'

export const schema = yup.object({
  email: yup
    .string()
    .required('E-Mail ist erforderlich')
    .email('Ungültige E-Mail-Adresse')
    .label('E-Mail'),
  firstName: yup.string().required('Vorname ist erforderlich').label('Vorname'),
  lastName: yup.string().required('Nachname ist erforderlich').label('Nachname'),
  municipalityId: yup.number().required('Gemeinde ist erforderlich').label('Gemeinde'),
  role: yup.string().required('Rolle ist erforderlich').label('Rolle')
})
