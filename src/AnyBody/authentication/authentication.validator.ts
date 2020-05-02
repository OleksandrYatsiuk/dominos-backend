
import { validationResult, body } from 'express-validator';
export default function validator() {
    console.log('validator');
    switch ('login') {
        case 'login': {
            return [
                body(["username", "password"]).exists({ checkFalsy: true }).withMessage("cannot be blank."),
                // body('username').custom(async (value, { req }) => {
                //     const user = await user.find({ username: req.body.username })
                //     if (user.length > 0) {
                //         if (!bcrypt.compareSync(req.body.password, user[0].passwordHash)) {
                //             throw new Error("or Password is invalid.")
                //         }
                //     } else {
                //         throw new Error("or Password is invalid.")
                //     }
                // })
            ]
        }
    }
}