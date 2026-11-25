"use strict";

const asyncHandler = require("../../middleware/asyncHandler");
const ResponseHelper = require("../../helpers/response.helper");

const {
    adminPaymentReminderLogService,
} = require("../../services/index");


/* =========================================================
   GET REMINDER LOGS
========================================================= */

const getPaymentReminderLogs =
    asyncHandler(async (req, res) => {
        const logs =
            await adminPaymentReminderLogService.getReminderLogs({
                page:
                    Number(req.query.page) || 1,

                limit:
                    Number(req.query.limit) || 10,

                payment_id:
                    req.query.payment_id,

                payment_reminder_id:
                    req.query.payment_reminder_id,

                status:
                    req.query.status,

                channel:
                    req.query.channel,

                from_date:
                    req.query.from_date,

                to_date:
                    req.query.to_date,
            });

        return ResponseHelper.success(
            res,
            "Payment reminder logs fetched successfully.",
            logs
        );
    });

/* =========================================================
   GET REMINDER LOG
========================================================= */

const getPaymentReminderLog =
    asyncHandler(async (req, res) => {
        const log =
            await adminPaymentReminderLogService.getReminderLog(
                req.params.uuid
            );

        return ResponseHelper.success(
            res,
            "Payment reminder log fetched successfully.",
            log
        );
    });

/* =========================================================
   LOGS BY PAYMENT
========================================================= */

const getPaymentReminderLogsByPayment =
    asyncHandler(async (req, res) => {
        const logs =
            await adminPaymentReminderLogService.getLogsByPayment(
                req.params.paymentUuid,
                {
                    page:
                        Number(req.query.page) || 1,

                    limit:
                        Number(req.query.limit) || 10,

                    status:
                        req.query.status,

                    channel:
                        req.query.channel,

                    from_date:
                        req.query.from_date,

                    to_date:
                        req.query.to_date,
                }
            );

        return ResponseHelper.success(
            res,
            "Payment reminder logs fetched successfully.",
            logs
        );
    });

/* =========================================================
   LOGS BY REMINDER
========================================================= */

const getPaymentReminderLogsByReminder =
    asyncHandler(async (req, res) => {
        const logs =
            await adminPaymentReminderLogService.getLogsByReminder(
                req.params.reminderUuid,
                {
                    page:
                        Number(req.query.page) || 1,

                    limit:
                        Number(req.query.limit) || 10,

                    status:
                        req.query.status,

                    channel:
                        req.query.channel,

                    from_date:
                        req.query.from_date,

                    to_date:
                        req.query.to_date,
                }
            );

        return ResponseHelper.success(
            res,
            "Payment reminder logs fetched successfully.",
            logs
        );
    });

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getPaymentReminderLogs,
    getPaymentReminderLog,
    getPaymentReminderLogsByPayment,
    getPaymentReminderLogsByReminder,
};