import * as nodemailer from "nodemailer";
import * as pug from 'pug';
import * as Mail from "nodemailer/lib/mailer";

export default class EmailSenderService {

    constructor() { }

    public initProfile() {
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true, // use SSL
            auth: {
                user: process.env.GMAIL_USER, // generated ethereal user
                pass: process.env.GMAIL_PASSWORD, // generated ethereal password
            },
        })
    }

    public send(to: string, subject: string, path: string, htmlOptions?: object, options?: Mail.Options) {
        const opt = Object.assign({
            from: `Dominos App <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html: pug.renderFile(__dirname + '/notifications/' + `${path}`, htmlOptions), // html body
        }, options)
        return this.initProfile().sendMail(opt);

    }
}