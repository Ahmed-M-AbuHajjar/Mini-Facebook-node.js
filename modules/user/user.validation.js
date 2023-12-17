import joi from 'joi';

export const updatePasswordSchema = {
    body: joi
        .object()
        .required()
        .keys({
            currentPassword: joi.string().pattern(new RegExp("^[A-Z][a-z1-9]{4,15}$")).required(),
            newPassword: joi.string().pattern(new RegExp("^[A-Z][a-z1-9]{4,15}$")).required(),
            newCPassword: joi.string().valid(joi.ref("newPassword")).required(),
        }),
    headers: joi
        .object()
        .required()
        .keys({
            authorization: joi.string().required(),
        }).unknown(true)
};

export const deleteUserSchema = {
    headers: joi
    .object()
    .required()
    .keys({
        authorization: joi.string().required(),
    }).unknown(true)
};

export const getSpecificUserSchema = {
    headers: joi
    .object()
    .required()
    .keys({
        authorization: joi.string().required(),
    }).unknown(true)
};