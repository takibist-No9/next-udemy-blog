'use server';

import { registerSchema } from '@/validations/user';
import { Record } from '@prisma/client/runtime/client';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';

type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

function handleValidationError(
  error: ZodError<{
    name: string;
    email: string;
    password: string;
    confirmedPassword: string;
  }>,
): ActionState {
  const { fieldErrors, formErrors } = error.flatten();

  // zodの仕様でパスワード一致確認のエラーは formErrorsで渡ってくる
  // formErrorsがある場合は、confirmPasswordフィールドにエラーを追加
  const errors = formErrors.length
    ? { ...fieldErrors, confirmedPassword: formErrors }
    : fieldErrors;
  return { success: false, errors };
}

// カスタムエラー処理
function handleError(customErrors: Record<string, string[]>): ActionState {
  return { success: false, errors: customErrors };
}

export async function createUser(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // フォームから渡ってきた情報を取得
  const rawFormData = Object.fromEntries(
    ['name', 'email', 'password', 'confirmedPassword'].map((field) => [
      field,
      formData.get(field) as string,
    ]),
  );

  // validation
  const validationResult = registerSchema.safeParse(rawFormData);
  if (!validationResult.success) {
    return handleValidationError(validationResult.error);
  }

  // DBにメールアドレスが存在しているかの確認
  const existingUser = await prisma.user.findUnique({
    where: { email: rawFormData.email },
  });
  if (existingUser) {
    return handleError({ email: ['このメールアドレスは既に登録されています'] });
  }

  // DBに登録
  const hashedPassword = await bcrypt.hash(rawFormData.password, 12);
  await prisma.user.create({
    data: {
      name: rawFormData.name,
      email: rawFormData.email,
      password: hashedPassword,
    },
  });

  // dashboardへリダイレクト
  await signIn('credentials', {
    ...Object.fromEntries(formData),
    redirect: false,
  });

  redirect('/dashboard');
}
