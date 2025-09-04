import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import JWT_SECRET from '@repo/config/config';


export function middleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" });
    }

    // Extract token after "Bearer "
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7) 
        : authHeader;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded) {
            // @ts-ignore
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(403).json({ message: "Unauthorized" });
        }
    } catch (e) {
        console.error("JWT verify error:", e);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
