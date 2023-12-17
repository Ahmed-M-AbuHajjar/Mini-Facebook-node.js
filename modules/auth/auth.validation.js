import joi from 'joi';

export const signUpSchema = {
    body: joi
        .object()
        .required()
        .keys({
            name: joi.string().min(4).max(10).required(),
            email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
            password: joi.string().pattern(new RegExp("^[A-Z][a-z1-9]{4,15}$")).required(),
            cPassword: joi.ref("password"),
        }),
    query: joi
        .object()
        .required()
        .keys({
            boo: joi.string()
        })
};