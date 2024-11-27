import * as yup from 'yup';

declare module 'yup' {
  interface StringSchema {
    checkYearExpiration(): StringSchema;
    checkIsTwoWordsName(): StringSchema;
  }
}
function checkYearExpiration() {
  return this.test({
    name: `checkYearExpiration`,
    message: 'Год невалиден',
    test: function (value: string) {
      return (
        value.length === 5 && Number(value.slice(3, 5)) >= 21 && Number(value.slice(3, 5)) <= 26
      );
    },
  });
}

function checkIsTwoWordsName() {
  return this.test({
    name: `checkIsTwoWordsName`,
    message: 'Введите имя и фамилию',
    test: function (value: string) {
      return value.trim().split(' ').length - 1 === 1;
    },
  });
}

yup.addMethod(yup.string, 'checkYearExpiration', checkYearExpiration);
yup.addMethod(yup.string, 'checkIsTwoWordsName', checkIsTwoWordsName);

export const payFormSchema = yup.object({
  pan: yup
    .string()
    .required('Обязательное поле')
    .min(13, 'Номер карты должен содержать минимум 13 цифр')
    .max(19, 'Номер карты должен содержать не больше 19 цифр')
    .matches(/^[0-9]*$/, 'Номер карты должен состоять из цифр'),
  expire: yup.string().checkYearExpiration().required('Обязательное поле'),
  cvc: yup
    .string()
    .required('Обязательное поле')
    .min(3, 'Требуется 3 цифры')
    .max(3, 'Максимальная длина - 3'),
  cardholder: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, 'Допустимы только латинские буквы')
    .checkIsTwoWordsName()
    .required('Обязательное поле')
    .trim(),
});
