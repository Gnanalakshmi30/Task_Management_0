import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
    mobile: Yup.string().when('loginMethod', {
        is: 'phone',
        then: (schema) =>
            schema
                .required('Phone number is required')
                .matches(/^[0-9]+$/, 'Only numbers are allowed')
                .min(10, 'Phone number must be at least 10 digits')
                .max(15, 'Phone number can be at most 15 digits'),
        otherwise: (schema) => schema.strip(),
    }),
    email: Yup.string().when('loginMethod', {
        is: 'email',
        then: (schema) =>
            schema
                .required('Email is required')
                .email('Invalid email address'),
        otherwise: (schema) => schema.strip(),
    }),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    loginMethod: Yup.string().oneOf(['phone', 'email', 'google']).required(),
});


export default loginSchema;