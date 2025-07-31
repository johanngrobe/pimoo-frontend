import * as yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(yup) // extend yup

export const schema = yup.object({
  vorname: yup.string().required('Vorname ist erforderlich').label('Vorname'),
  nachname: yup.string().required('Nachname ist erforderlich').label('Nachname'),
  rolleId: yup.number().required('BenutzerRolle ist erforderlich').label('Benutzerrolle'),
  gemeindeId: yup.number().required('Gemeinde ist erforderlich').label('Gemeinde'),
  email: yup
    .string()
    .required('E-Mail ist erforderlich')
    .email('Ungültige E-Mail-Adresse')
    .label('E-Mail'),
  password: yup
    .string()
    .min(8, 'Passwort muss mindestens 8 Zeichen lang sein')
    .minLowercase(1, 'Passwort muss mindestens 1 Kleinbuchstaben enthalten')
    .minUppercase(1, 'Passwort muss mindestens 1 Großbuchstaben enthalten')
    .minNumbers(1, 'Passwort muss mindestens 1 Zahl enthalten')
    .minSymbols(1, 'Passwort muss mindestens 1 Sonderzeichen enthalten')
    .required('Passwort ist erforderlich')
    .label('Passwort'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwörter müssen übereinstimmen')
    .required('Passwortwiederholung ist erforderlich')
    .label('Passwort wiederholen')
})
