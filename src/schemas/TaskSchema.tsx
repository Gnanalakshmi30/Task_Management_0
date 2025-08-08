import * as Yup from 'yup';

export const taskSchema = Yup.object().shape({
    id: Yup.string().when('operationMethod', {
        is: (op: string) => op === 'update' || op === 'delete',
        then: (schema) => schema.required('Task ID is required'),
        otherwise: (schema) => schema.strip(),
    }),

    name: Yup.string().when('operationMethod', {
        is: (op: string) => op === 'create' || op === 'update',
        then: (schema) => schema.required('Task name is required'),
        otherwise: (schema) => schema.notRequired(),
    }),

    description: Yup.string().notRequired(),

    status: Yup.string()
        .oneOf(['Pending', 'In-progress', 'Completed'])
        .when('operationMethod', {
            is: (op: string) => op === 'create' || op === 'update',
            then: (schema) => schema.required('Status is required'),
            otherwise: (schema) => schema.notRequired(),
        }),

    dueDate: Yup.string().when('operationMethod', {
        is: (op: string) => op === 'create' || op === 'update',
        then: (schema) => schema.required('Due date is required'),
        otherwise: (schema) => schema.notRequired(),
    }),

    operationMethod: Yup.string()
        .oneOf(['create', 'update', 'delete'])
        .required('Operation method is required'),
}).noUnknown();
