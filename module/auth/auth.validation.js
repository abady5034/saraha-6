import z, { uppercase } from "zod";
import { GenderEnum, RoleEnum } from "../../common/Enums/enum.js";
let errorValidation = {
  invalidEmail: {
    ar: "البريد الالكتروني غير صحيح",
    en: "Email Indataid",
  },
  minLengthPassword: {
    ar: "يجب أن تكون كلمة المرور 8 خانات على الأقل",
    en: "Password must be at least 8 characters long",
  },
  upperCasePassword: {
    ar: "يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)",
    en: "Password must contain at least one uppercase letter",
  },
  lowerCasePassword: {
    ar: "يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)",
    en: "Password must contain at least one lowercase letter",
  },
  numberPassword: {
    ar: "يجب أن تحتوي على رقم واحد على الأقل (0-9)",
    en: "Password must contain at least one number",
  },
  specialPassword: {
    ar: "يجب أن تحتوي على رمز خاص واحد على الأقل (مثل @$!%*?&)",
    en: "Password must contain at least one special character",
  },
  confirmPassword: {
    ar: "تاكيد كلمة المرور غير صحيحة",
    en: "Confirm Password Not Matched",
  },
  phoneErrors: {
    ar: "رقم الهاتف غير مدعوم",
    en: "Phone number not supported",
  },
};
let regex = {
  email:
    /^[a-zA-Z0-9._%+-]+@(gmail\.com|icloud\.com|outlook\.com|hotmail\.com|yahoo\.com)$/,
  phoneNumber: /^(?:\+201[0125]\d{8}|\+9665\d{8})$/,
  upperCasePassword: /[A-Z]/,
  lowerCasePassword: /[a-z]/,
  numberPassword: /[0-9]/,
  specialPassword: /[^A-Za-z0-9]/,
};

const getErrorMessage = (errCode, lang = "en") => {
  return errorValidation[errCode][lang];
};

export const userLoginSchema = (lang) =>
  z.object({
    body: z.object({
      email: z.string().email({ error: getErrorMessage("invalidEmail", lang) }),
      password: z.string(),
    })
  });

export const userSignupSchema = (lang) =>
  z.object({
    body: userLoginSchema(lang)
      .extend({
        uniqueName: z.string().min(3).max(20),
        firstName: z.string().min(3).max(20),
        lastName: z.string().min(3).max(20),
        password: z
          .string()
          .min(8, { error: getErrorMessage("minLengthPassword", lang) }),
        confirmPassword: z.string(),
        age: z.coerce.number().min(18).max(70),
        phoneNumber: z.array(z.string().regex(regex.phoneNumber)),
        gender: z.enum(GenderEnum),
        role: z.enum(RoleEnum),
      })
  })
    .refine(
      (data) => {
        return regex.email.test(data.body.email);
      },
      {
        message: getErrorMessage("invalidEmail", lang),
        path: ["email"],
      },
    )
    .refine(
      (data) => {
        return data.body.password === data.body.confirmPassword;
      },
      {
        message: getErrorMessage("confirmPassword", lang),
        path: ["Confirm Password"],
      },
    )
    .refine(
      (data) => {
        return regex.phoneNumber.test(data.body.phoneNumber[0]);
      },
      {
        message: getErrorMessage("phoneErrors", lang),
        path: ["phoneNumber"],
      },
    )
    .refine(
      (data) => {
        return regex.upperCasePassword.test(data.body.password);
      },
      {
        message: getErrorMessage("upperCasePassword", lang),
        path: ["password"],
      },
    )
    .refine(
      (data) => {
        return regex.lowerCasePassword.test(data.body.password);
      },
      {
        message: getErrorMessage("lowerCasePassword", lang),
        path: ["password"],
      },
    )
    .refine(
      (data) => {
        return regex.specialPassword.test(data.body.password);
      },
      {
        message: getErrorMessage("specialPassword", lang),
        path: ["password"],
      },
    );

export const createNewAccessTokenSchema = () =>
  z.strictObject({
    refreshToken: z.jwt({ alg: "HS256" }),
  });
