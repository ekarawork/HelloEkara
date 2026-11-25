"use strict";

const {
    adminPaymentReminderLogRepository,
    adminNotificationRepository,
} = require("../../repositories/index");

const {
    sequelize,
} = require("../../database/models");

const {
    sendHtmlMail,
} = require("../../helpers/mail.helper");

const logger = require("../../utils/winston.util");

/* =========================================================
   PROCESS SINGLE REMINDER LOG
========================================================= */

const processReminderLog = async (
    reminderLog
) => {
    const transaction =
        await sequelize.transaction();

    try {
        const payment =
            reminderLog.payment;

        const reminder =
            reminderLog.paymentReminder;

        if (!payment) {
            throw new Error(
                "Payment not found for reminder log."
            );
        }

        if (!reminder) {
            throw new Error(
                "Payment reminder not found for reminder log."
            );
        }

        /* =====================================================
           GET CLIENT EMAIL
        ===================================================== */

        /*
         * IMPORTANT:
         *
         * Yahan payment ke client relation ke according
         * email lena hoga.
         *
         * Agar payment -> client association hai:
         *
         * payment.client.email
         *
         * to payment include mein client bhi hona chahiye.
         */

        const client =
            payment.client;

        const clientEmail =
            client?.email;

        /* =====================================================
           EMAIL
        ===================================================== */

        if (
            reminderLog.channel ===
                "email" ||
            !reminderLog.channel
        ) {
            if (!clientEmail) {
                throw new Error(
                    "Client email address not found."
                );
            }

            await sendHtmlMail({
                to: clientEmail,

                subject:
                    "Payment Reminder",

                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    ">

                        <h2>
                            Payment Reminder
                        </h2>

                        <p>
                            Dear ${client.name || "Customer"},
                        </p>

                        <p>
                            This is a reminder regarding
                            your pending payment.
                        </p>

                        <p>
                            <strong>
                                Amount:
                            </strong>
                            ₹${payment.amount}
                        </p>

                        <p>
                            <strong>
                                Due Date:
                            </strong>
                            ${payment.due_date}
                        </p>

                        <p>
                            ${reminderLog.message}
                        </p>

                        <p>
                            Thank you.
                        </p>

                    </div>
                `,
            });
        }

        /* =====================================================
           WEBSITE NOTIFICATION
        ===================================================== */

        await adminNotificationRepository.createNotification(
            {
                user_id:
                    payment.client_id,

                type:
                    "PAYMENT_REMINDER",

                title:
                    "Payment Reminder",

                message:
                    reminderLog.message,

                reference_type:
                    "payment",

                reference_id:
                    payment.id,

                is_read:
                    false,
            },
            transaction
        );

        /* =====================================================
           MARK LOG AS SENT
        ===================================================== */

        await adminPaymentReminderLogRepository.markAsSent(
            reminderLog,
            new Date(),
            transaction
        );

        await transaction.commit();

        return true;
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        /* =====================================================
           MARK FAILED
        ===================================================== */

        try {
            await adminPaymentReminderLogRepository.markAsFailed(
                reminderLog,
                error.message,
                null
            );
        } catch (statusError) {
            logger.error(
                statusError
            );
        }

        logger.error(error);

        return false;
    }
};

/* =========================================================
   PROCESS SCHEDULED REMINDERS
========================================================= */

const processScheduledReminders =
    async () => {
        const currentDateTime =
            new Date();

        const reminderLogs =
            await adminPaymentReminderLogRepository
                .getScheduledReminderLogs(
                    currentDateTime
                );

        if (
            !reminderLogs.length
        ) {
            return {
                processed: 0,
                successful: 0,
                failed: 0,
            };
        }

        let successful = 0;
        let failed = 0;

        for (
            const reminderLog
            of reminderLogs
        ) {
            const result =
                await processReminderLog(
                    reminderLog
                );

            if (result) {
                successful++;
            } else {
                failed++;
            }
        }

        return {
            processed:
                reminderLogs.length,

            successful,

            failed,
        };
    };

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    processReminderLog,
    processScheduledReminders,
};