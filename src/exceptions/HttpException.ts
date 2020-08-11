export class HttpException extends Error {
	public code: number;
	public result: string;

	constructor(code: number, result: any) {
		super(result);
		this.code = code;
		this.result = result;
	}
}
