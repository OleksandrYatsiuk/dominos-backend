import { Request, Response, NextFunction } from "express";
import { code422 } from "../middleware/base.response";
const maxFileSize = 10 * 1024 * 1024;

export default function checkFiles() {
    return (request: Request, response: Response, next: NextFunction) => {
        if (!request.file) {
            code422(response, {
                field: "file",
                message: `File can not be blank.`
            })
        } else {
            const { mimetype, size, originalname } = request.file;
            if (!mimetype.includes('image')) {
                code422(response, {
                    field: "file",
                    message: `File "${originalname}" should be image.`
                })
                if (size > maxFileSize) {
                    code422(response, {
                        field: "file",
                        message: `File ${originalname} should be less than 10Mib.`
                    })
                }
            } else {
                next()
            }
        }

    }
}