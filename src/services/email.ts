
import nodemailer from 'nodemailer';
import mailgen from 'mailgen';

import { GMAIL_USER, GMAIL_PASSWORD } from '@/config';

export const emailService = async (email: string, name: string, link: string) => {

    let config = {
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASSWORD
        }
    }

    const transporter = nodemailer.createTransport(config);

    const mailGenerator = new mailgen({
        theme: 'default',
        product: {
            name: 'Typescript Auth',
            link: 'https://mailgen.js/'
        }
    });

    let response = {
        body: {
            name: name,
            intro: 'Typescript auth is a sample project built as a templete to to reffer in feature projects.',
            action: {
                instructions: 'To reset your password, please click here:',
                button: {
                    color: '#22BC66',
                    text: 'Reset your password',
                    link: link
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    };

    let mail = mailGenerator.generate(response);

    const message = {
        from: GMAIL_USER,
        to: email,
        subject: "Reset your password ✔",
        text: "Hello reset your password?",
        html: mail
    }

    try {
        const info = await transporter.sendMail(message);
        if (!info) {
            return null;
        }

        console.log(info);

        return info;
    } catch (error) {
        console.log('[EMAIL_ERROR]: ', error);
        return null;
    }
}