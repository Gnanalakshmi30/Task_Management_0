import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    mobile: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    loginMethod: Yup.mixed<'general' | 'google'>()
        .oneOf(['general', 'google'])
        .required('Login method is required'),
});

export default registerSchema;
