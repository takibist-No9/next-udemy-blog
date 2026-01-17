import { object, string } from 'zod';

export const registerSchema = object({
  name: string().min(1, '名前は必須です'),
  email: string({ required_error: 'メールアドレスは必須です' })
    .min(1, 'メールアドレスは必須です')
    .email('不正なメールアドレスです'),
  password: string({ required_error: 'パスワード必須です' })
    .min(8, 'パスワードは最低8文字必要です')
    .max(32, 'パスワードは最大32文字以内にしてください'),
  confirmedPassword: string({
    required_error: '確認用パスワードは必須です',
  }).min(1, '確認用パスワードは必須です'),
}).refine((data) => data.password === data.confirmedPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmedPassword'],
});
