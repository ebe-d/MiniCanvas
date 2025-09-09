import { z } from 'zod'

export const CreateUserSchema = z.object({
    email: z.string()
        .min(5, 'Email must be at least 5 characters')
        .max(254, 'Email must be less than 254 characters')
        .email('Please enter a valid email address')
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(128, 'Password must be less than 128 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
        .trim()
})

export const SignInSchema = z.object({
    email: z.string()
        .min(5, 'Email must be at least 5 characters')
        .max(254, 'Email must be less than 254 characters')
        .email('Please enter a valid email address'),
    password: z.string()
        .min(1, 'Password is required')
        .max(128, 'Password is too long')
})

export const CreateRoomSchema = z.object({
    Roomname: z.string()
        .min(3, 'Room name must be at least 3 characters')
        .max(30, 'Room name must be less than 30 characters')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Room name can only contain letters, numbers, spaces, hyphens, and underscores')
        .trim()
})

