import * as nodemailer from "nodemailer";
import * as pug from 'pug';

export default class NodeMailer {

    constructor() { }

    public initProfile() {
        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true, // use SSL
            auth: {
                user: 'oleksandr.yatsiuk@gmail.com', // generated ethereal user
                pass: 'zxcvas!!', // generated ethereal password
            },
        })
    }

    public async send(emails:string , subject: string, html: any) {

        this.initProfile()
            .sendMail({
                from: 'Dominos App <oleksandr.yatsiuk@gmail.com>', // sender address
                to: emails, // list of receivers
                subject: subject, // Subject line
                html: pug.renderFile(__dirname + '/login.pug', {
                    title: 'Dominos app - Confirm your email',
                    link: 'https://test-leo-frontend.ci.gbksoft.net/'
                }), // html body
            })
            .then(result => console.log(result))
            .catch(err => console.log(err));
    }
}