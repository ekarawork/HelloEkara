"use strict";

const {
    adminPaymentReminderLogRepository,
} = require("../../repositories/index");

const {
    sequelize,
} = require("../../database/models");

const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/winston.util");


/* =========================================================
   GET LOG
========================================================= */

const getReminderLog = async (
    uuid
) => {
    const reminderLog =
        await adminPaymentReminderLogRepository.getReminderLogDetails(
            uuid
        );

    if (!reminderLog) {
        throw new ApiError(
            404,
            "Payment reminder log not found."
        );
    }

    return reminderLog;
};


/* =========================================================
   GET LOGS
========================================================= */

const getReminderLogs = async (
    query = {}
) => {
    return await adminPaymentReminderLogRepository.getPaymentReminderLogsList(
        query
    );
};


/* =========================================================
   GET LOGS BY PAYMENT
========================================================= */

const getLogsByPayment = async (
    paymentUuid,
    query = {}
) => {
    const payment =
        await adminPaymentReminderLogRepository.findPaymentByUuid(
            paymentUuid
        );

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found."
        );
    }

    return await adminPaymentReminderLogRepository.getPaymentReminderLogs(
        payment.id,
        query
    );
};


/* =========================================================
   GET LOGS BY REMINDER
========================================================= */

const getLogsByReminder = async (
    paymentReminderId,
    query = {}
) => {
    return await adminPaymentReminderLogRepository.getReminderLogs(
        paymentReminderId,
        query
    );
};


/* =========================================================
   PENDING LOGS
========================================================= */

const getPendingLogs = async (
    query = {}
) => {
    return await adminPaymentReminderLogRepository.getPendingReminderLogs(
        query
    );
};


/* =========================================================
   SCHEDULED LOGS
========================================================= */

const getScheduledLogs = async (
    currentDateTime,
    query = {}
) => {
    return await adminPaymentReminderLogRepository.getScheduledReminderLogs(
        currentDateTime,
        query
    );
};


/* =========================================================
   SENT LOGS
========================================================= */

const getSentLogs = async (
    query = {}
) => {
    return await adminPaymentReminderLogRepository.getSentReminderLogs(
        query
    );
};


/* =========================================================
   FAILED LOGS
========================================================= */

const getFailedLogs = async (
    query = {}
) => {
    return await adminPaymentReminderLogRepository.getFailedReminderLogs(
        query
    );
};

const calculateReminderScheduledFor = (
    dueDate,
    reminderType,
    daysOffset = 0
) => {
    const date = new Date(dueDate);

    if (Number.isNaN(date.getTime())) {
        throw new Error(
            "Invalid payment due date."
        );
    }

    const offset =
        Number(daysOffset) || 0;

    if (reminderType === "before") {
        date.setDate(
            date.getDate() - offset
        );
    }

    if (reminderType === "after") {
        date.setDate(
            date.getDate() + offset
        );
    }

    return date;
};


const generatePaymentReminderLog = async (
    reminder,
    payment,
    transaction
) => {
    if (!reminder.enabled) {
        return null;
    }

    const scheduledFor =
        calculateReminderScheduledFor(
            payment.due_date,
            reminder.reminder_type,
            reminder.days_offset
        );

    return await adminPaymentReminderLogRepository
        .createReminderLogIfNotExists(
            reminder,
            scheduledFor,
            transaction
        );
};
/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    getReminderLog,
    getReminderLogs,
    getLogsByPayment,
    getLogsByReminder,
    getPendingLogs,
    getScheduledLogs,
    getSentLogs,
    getFailedLogs,
    calculateReminderScheduledFor,
    generatePaymentReminderLog,
};