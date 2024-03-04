import { body } from "express-validator";

export const registerValidation = [
    body("email", "Enter correct email").isEmail(),
    body("fullName", "Enter full name").isLength({ min: 3 }),
    body("username", "Enter username").isLength({ min: 3, max: 16 }),
    body("password", "Enter password").isLength({ min: 8, max: 32 }),
]

export const loginValidation = [
    body("email", "Enter correct email").isEmail(),
    body("password", "Enter password").isLength({ min: 8, max: 32 }),
]