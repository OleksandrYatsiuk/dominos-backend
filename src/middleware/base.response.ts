import { Request, Response, NextFunction } from "express";
import { Pagination } from "controllers/UserManagement.controller";

export interface Errors {
    field: string,
    message: string
}


export function code422(response: Response, errors: any) {
    response.status(422).json({
        code: 422,
        status: "Error",
        message: 'Unprocessable Entity',
        result: errors
    })
}

export function code200(response: Response, data?: any | null) {
    response.status(200).json({
        code: 200,
        status: "Success",
        message: 'OK',
        result: data
    })
}

export function code401(response: Response) {
    response.status(401).json({
        code: 401,
        status: "Error",
        message: 'Unauthorized',
        result: "Your request was made with invalid credentials."
    })
}

export function code200DataProvider(response: Response, pagination: Pagination, data?: any | null) {
    response.status(200).json({
        code: 200,
        status: "Success",
        message: 'OK',
        result: data,
        _meta: {
            pagination: pagination
        }

    })
}
export function code201(response: Response, data: any) {
    response.status(201).json({
        code: 201,
        status: "Success",
        message: 'Created',
        result: data
    })
}

export function code404(response: Response, data: any) {
    response.status(404).json({
        code: 404,
        status: "Error",
        message: 'Not Found',
        result: data
    })
}

export function code204(response: Response) {
    response.status(204).json()
}

export function code500(response: Response, data?: any | null) {
    response.status(500).json({
        code: 500,
        status: "Error",
        message: 'Internal Server Error',
        result: data
    })
}