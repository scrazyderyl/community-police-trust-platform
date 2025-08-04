import * as Yup from 'yup';

export const VALIDATION_SCHEMA = Yup.object({
  username: Yup.string()
    .test(
      'username-or-email',
      function (value) {
        const { path, createError } = this;

        // Required
        if (!value) {
          return createError({ path, message: 'Required' });
        }

        if (value.includes('@')) {
          // Validate as email
          if (!Yup.string().email().isValidSync(value)) {
            return createError({ path, message: 'Must be a valid email address' });
          }
        } else {
          // Validate as username
          if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return createError({ path, message: 'Username can only contain letters, numbers, and underscores' });
          }
        }

        return true;
      }
    ),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
}).noUnknown();
