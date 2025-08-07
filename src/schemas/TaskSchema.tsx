import * as Yup from 'yup';

export const getTaskSchema = (operation: 'create' | 'update' | 'delete') => {
    const baseSchema = {
        name: Yup.string().when('$operation', {
            is: (op: string) => op === 'create' || op === 'update',
            then: (schema) => schema.required('Task name is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
        description: Yup.string().notRequired(),
        status: Yup.string()
            .oneOf(['pending', 'in-progress', 'completed'])
            .notRequired(),
        dueDate: Yup.date().notRequired(),
    };

    if (operation === 'create') {
        return Yup.object().shape({
            ...baseSchema,
        }).noUnknown();
    }

    if (operation === 'update') {
        return Yup.object().shape({
            id: Yup.string().required('Task ID is required for update'),
            ...baseSchema,
        }).noUnknown();
    }

    if (operation === 'delete') {
        return Yup.object().shape({
            id: Yup.string().required('Task ID is required for delete'),
        }).noUnknown();
    }

    throw new Error('Invalid schema operation');
};
