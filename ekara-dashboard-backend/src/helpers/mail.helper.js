"use strict";

const nodemailer = require("nodemailer");

/* =========================================================
   MAIL TRANSPORTER
========================================================= */

const transporter = nodemailer.createTransport({
    host:
        process.env.MAIL_HOST ||
        "smtp.zoho.com",

    port:
        Number(process.env.MAIL_PORT) ||
        465,

    secure:
        String(
            process.env.MAIL_SECURE || "true"
        ).toLowerCase() === "true",

    auth: {
        user:
            process.env.MAIL_USER,

        pass:
            process.env.MAIL_PASSWORD,
    },
});

/* =========================================================
   VERIFY MAIL CONNECTION
========================================================= */

const verifyMailConnection = async () => {
    try {
        await transporter.verify();

        console.log(
            "Zoho Mail SMTP connection successful."
        );

        return true;
    } catch (error) {
        console.error(
            "Zoho Mail SMTP connection failed:",
            error.message
        );

        return false;
    }
};

/* =========================================================
   SEND EMAIL
========================================================= */

const sendMail = async ({
    to,
    subject,
    text = null,
    html = null,
    cc = undefined,
    bcc = undefined,
    replyTo = undefined,
    attachments = undefined,
}) => {
    if (!to) {
        throw new Error(
            "Recipient email address is required."
        );
    }

    if (!subject) {
        throw new Error(
            "Email subject is required."
        );
    }

    if (!text && !html) {
        throw new Error(
            "Email text or HTML content is required."
        );
    }

    const mailOptions = {
        from: {
            name:
                process.env.MAIL_FROM_NAME ||
                "Admin",

            address:
                process.env.MAIL_FROM_EMAIL ||
                process.env.MAIL_USER,
        },

        to,

        subject,

        ...(text && {
            text,
        }),

        ...(html && {
            html,
        }),

        ...(cc && {
            cc,
        }),

        ...(bcc && {
            bcc,
        }),

        ...(replyTo && {
            replyTo,
        }),

        ...(attachments && {
            attachments,
        }),
    };

    return await transporter.sendMail(
        mailOptions
    );
};

/* =========================================================
   SEND HTML EMAIL
========================================================= */

const sendHtmlMail = async ({
    to,
    subject,
    html,
    text = null,
    cc = undefined,
    bcc = undefined,
    replyTo = undefined,
}) => {
    return await sendMail({
        to,
        subject,
        html,
        text,
        cc,
        bcc,
        replyTo,
    });
};

/* =========================================================
   SEND TEXT EMAIL
========================================================= */

const sendTextMail = async ({
    to,
    subject,
    text,
    cc = undefined,
    bcc = undefined,
    replyTo = undefined,
}) => {
    return await sendMail({
        to,
        subject,
        text,
        cc,
        bcc,
        replyTo,
    });
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    transporter,
    verifyMailConnection,
    sendMail,
    sendHtmlMail,
    sendTextMail,
};