import { ZodError } from "zod";

export function formatZodErrors(error: ZodError): string[] | null {
    if (process.env.NODE_ENV === "production") {
        return null;
    }

    return error.errors.map((e) => {
        const path = e.path;
        // If first part of path is a number (e.g., for array item), skip it
        const formattedPath = typeof path[0] === 'number' ? path.slice(1).join('.') : path.join('.');
        return `${formattedPath || 'root'}: ${e.message}`;
    });
}
