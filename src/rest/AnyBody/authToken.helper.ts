
import authToken from './authToken.model';

export class AuthorizeTokenHelper {
    private token = authToken;
    constructor() { }

    public getItem(token: string) {
        return this.token.findOne({ token }).then(result => { return result });
    }

    public removeItem(userId: string) {
        return this.token.findByIdAndDelete(userId);
    }
}