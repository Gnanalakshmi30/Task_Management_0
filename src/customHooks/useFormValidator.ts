
import { useState } from 'react';
import * as Yup from 'yup';

interface Errors {
    [key: string]: string | undefined;
}

export const useFormValidator = <T extends object>(schema: Yup.ObjectSchema<any>) => {
    const [errors, setErrors] = useState<Errors>({});

    const validate = async (values: T): Promise<boolean> => {
        try {
            await schema.validate(values, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationError: any) {

            const newErrors: Errors = {};
            if (validationError.inner) {
                validationError.inner.forEach((err: Yup.ValidationError) => {
                    if (err.path) newErrors[err.path] = err.message;
                });
            }
            setErrors(newErrors);
            return false;
        }
    };

    const clearError = (field: keyof T | (keyof T)[]) => {
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            if (Array.isArray(field)) {
                field.forEach(f => delete newErrors[f as string]);
            } else {
                delete newErrors[field as string];
            }
            return newErrors;
        });
    };


    return { errors, validate, clearError };
};
