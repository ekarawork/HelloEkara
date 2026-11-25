"use strict";

const {
    adminPaymentReminderLogRepository,
} = require("../repositories/index");

const {
    adminNotificationService,
} = require("../services/index");


const {
    sequelize,
} = require("../database/models");

const {
    sendMail,
} = require("../helpers/mail.helper");

const logger = require("../utils/winston.util");


/* =========================================================
   CONFIG
========================================================= */

const SCHEDULER_INTERVAL =
    Number(
        process.env.PAYMENT_REMINDER_SCHEDULER_INTERVAL
    ) || 60000;


/* =========================================================
   PROCESS SINGLE REMINDER LOG
========================================================= */

const processReminderLog = async (
    reminderLog
) => {
    const transaction =
        await sequelize.transaction();

    try {
        /*
         * =====================================================
         * IMPORTANT
         * =====================================================
         *
         * Scheduler dobara same log process na kare,
         * isliye transaction ke andar fresh record lena
         * better hai.
         */

        const log =
            await adminPaymentReminderLogRepository.findById(
                reminderLog.id,
                {
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                }
            );

        if (!log) {
            await transaction.rollback();
            return;
        }

        /*
         * Already processed
         */

        if (log.status !== "pending") {
            await transaction.rollback();
            return;
        }


        /* =====================================================
           PAYMENT / REMINDER DATA
        ===================================================== */

        const payment =
            log.payment;

        const reminder =
            log.paymentReminder;

        if (!payment || !reminder) {
            throw new Error(
                "Payment or payment reminder data not found."
            );
        }


        /* =====================================================
           REMINDER ENABLE CHECK
        ===================================================== */

        if (!reminder.enabled) {
            await transaction.rollback();

            logger.info(
                `Payment reminder disabled. Log ID: ${log.id}`
            );

            return;
        }


        /* =====================================================
           PAYMENT REMINDER ENABLE CHECK
        ===================================================== */

        if (
            payment.enable_reminders === false
        ) {
            await transaction.rollback();

            logger.info(
                `Payment reminders disabled for payment. Log ID: ${log.id}`
            );

            return;
        }


        /* =====================================================
           CHANNEL
        ===================================================== */

        const channel =
            log.channel ||
            reminder.channel ||
            "email";


        /* =====================================================
           EMAIL
        ===================================================== */

        if (channel === "email") {

            /*
             * Yahan recipient email payment/client
             * relation ke according lena hoga.
             *
             * Agar payment ke andar client relation
             * available hai:
             */

            const client =
                payment.client;

            if (
                !client ||
                !client.email
            ) {
                throw new Error(
                    "Client email address not found."
                );
            }


            await sendMail({
                to: client.email,

                subject:
                    "Payment Reminder",

                text:
                    log.message,

                html: `
                    <div style="font-family: Arial, sans-serif;">
                        <h2>Payment Reminder</h2>

                        <p>
                            ${log.message}
                        </p>

                        <p>
                            This is an automated payment reminder.
                        </p>
                    </div>
                `,
            });
        }


        /* =====================================================
           WEBSITE NOTIFICATION
        ===================================================== */

        if (channel === "website") {

            const client =
                payment.client;

            if (
                !client ||
                !client.id
            ) {
                throw new Error(
                    "Client not found for website notification."
                );
            }

            await adminNotificationService.createNotification(
                {
                    user_id:
                        client.user_id || client.id,

                    type:
                        "PAYMENT_REMINDER",

                    title:
                        "Payment Reminder",

                    message:
                        log.message,

                    reference_type:
                        "payment",

                    reference_id:
                        payment.id,

                    is_read:
                        false,
                },
                transaction
            );
        }


        /* =====================================================
           MARK AS SENT
        ===================================================== */

        await adminPaymentReminderLogRepository.markAsSent(
            log,
            new Date(),
            transaction
        );


        await transaction.commit();


        logger.info(
            `Payment reminder sent successfully. Log ID: ${log.id}`
        );

    } catch (error) {

        if (
            transaction &&
            !transaction.finished
        ) {
            await transaction.rollback();
        }


        /* =====================================================
           MARK FAILED
        ===================================================== */

        try {

            const failedTransaction =
                await sequelize.transaction();

            const failedLog =
                await adminPaymentReminderLogRepository.findById(
                    reminderLog.id,
                    {
                        transaction:
                            failedTransaction,
                    }
                );

            if (
                failedLog &&
                failedLog.status === "pending"
            ) {

                await adminPaymentReminderLogRepository.markAsFailed(
                    failedLog,
                    error.message,
                    failedTransaction
                );
            }

            await failedTransaction.commit();

        } catch (statusError) {

            logger.error(
                "Failed to update reminder log status.",
                statusError
            );
        }


        logger.error(
            `Payment reminder processing failed. Log ID: ${reminderLog.id}`,
            error
        );
    }
};


/* =========================================================
   PROCESS SCHEDULED REMINDERS
========================================================= */

const processScheduledPaymentReminders =
    async () => {

        try {

            const currentDateTime =
                new Date();


            /*
             * scheduled_for <= current time
             * AND status = pending
             */

            const logs =
                await adminPaymentReminderLogRepository
                    .getScheduledReminderLogs(
                        currentDateTime
                    );


            if (!logs.length) {
                return;
            }


            logger.info(
                `Payment reminder scheduler found ${logs.length} scheduled reminder(s).`
            );


            for (const reminderLog of logs) {

                await processReminderLog(
                    reminderLog
                );
            }

        } catch (error) {

            logger.error(
                "Payment reminder scheduler failed.",
                error
            );
        }
    };


/* =========================================================
   START SCHEDULER
========================================================= */

let schedulerInterval = null;

const startPaymentReminderScheduler =
    () => {

        if (schedulerInterval) {

            logger.warn(
                "Payment reminder scheduler is already running."
            );

            return;
        }


        logger.info(
            "Payment reminder scheduler started."
        );


        /*
         * Run immediately
         */

        processScheduledPaymentReminders();


        /*
         * Run periodically
         */

        schedulerInterval =
            setInterval(
                processScheduledPaymentReminders,
                SCHEDULER_INTERVAL
            );
    };


/* =========================================================
   STOP SCHEDULER
========================================================= */

const stopPaymentReminderScheduler =
    () => {

        if (!schedulerInterval) {
            return;
        }


        clearInterval(
            schedulerInterval
        );

        schedulerInterval = null;


        logger.info(
            "Payment reminder scheduler stopped."
        );
    };


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    startPaymentReminderScheduler,
    stopPaymentReminderScheduler,
    processScheduledPaymentReminders,
};