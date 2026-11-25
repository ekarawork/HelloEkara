// admin repository
const authRepository = require('./admin/auth.repository');
const sessionRepository = require('./admin/session.repository');
const loginLogRepository = require('./admin/loginLog.repository');
const adminClientRepository = require('./admin/client.repository');
const adminClientPerformanceRepository = require("./admin/clientPerformance.repository");
const adminPaymentRepository = require("./admin/payment.repository");
const adminPaymentReminderRepository = require("./admin/paymentReminder.repository");
const adminPaymentReminderLogRepository = require("./admin/paymentReminderLog.repository");
const adminNotificationRepository = require("./admin/notification.repository");
const adminSocialCalendarRepository = require("./admin/socialCalendar.repository");
const settingsRepository = require("./admin/settings.repository");
const adminExportRepository = require("./admin/export.repository");
const adminEmployeeRepository = require("./admin/employee.repository");
const adminTaskRepository = require("./admin/task.repository");
const adminTaskMessageRepository = require("./admin/task.message.repository");
const adminTaskAttachmentRepository = require("./admin/task.attachment.repository");
const adminDashboardRepository = require("./admin/dashboard.repository");
const clientPortalRepository = require("./admin/clientPortal.repository");

// client repository
const clientmetaadsPerformanceRepository = require("./client/metaadsPerformance.repository");
const clientGoogleAdsPerformanceRepository = require("./client/googleadsPerformance.repository");
const clientLeadsRepository = require("./client/leads.repository");
const clientPaymentsRepository = require("./client/payments.repository");
const clientSocialCalendarRepository = require("./client/socialCalendar.repository");
const clientDashboardRepository = require("./client/dashboard.repository");
const clientSettingsRepository = require("./client/settings.repository");

// employee repository
const employeeSettingsRepository = require("./employee/settings.repository");
const employeeTaskRepository = require("./employee/task.repository");
const employeeTaskMessageRepository = require("./employee/task-message.repository");
const employeeTaskAttachmentRepository = require("./employee/task-attachment.repository");
const employeeDashboardRepository = require("./employee/dashboard.repository");

module.exports = {
    
    // admin repository
    authRepository:require('./admin/auth.repository'),
    sessionRepository:require('./admin/session.repository'),
    loginLogRepository:require('./admin/loginLog.repository'),
    adminClientRepository:require('./admin/client.repository'),
    adminClientPerformanceRepository:require('./admin/clientPerformance.repository'),
    adminPaymentRepository:require('./admin/payment.repository'),
    adminPaymentReminderRepository:require('./admin/paymentReminder.repository'),
    adminPaymentReminderLogRepository:require('./admin/paymentReminderLog.repository'),
    adminNotificationRepository:require('./admin/notification.repository'),
    adminSocialCalendarRepository:require('./admin/socialCalendar.repository'),
    settingsRepository:require('./admin/settings.repository'),
    adminExportRepository:require('./admin/export.repository'),
    adminEmployeeRepository:require('./admin/employee.repository'),
    adminTaskRepository:require('./admin/task.repository'),
    adminTaskMessageRepository:require('./admin/task.message.repository'),
    adminTaskAttachmentRepository:require('./admin/task.attachment.repository'),
    adminDashboardRepository:require('./admin/dashboard.repository'),
    clientPortalRepository:require('./admin/clientPortal.repository'),

    // client repository
    clientmetaadsPerformanceRepository:require('./client/metaadsPerformance.repository'),
    clientGoogleAdsPerformanceRepository:require('./client/googleadsPerformance.repository'),
    clientLeadsRepository:require('./client/leads.repository'),
    clientPaymentsRepository:require('./client/payments.repository'),
    clientSocialCalendarRepository:require('./client/socialCalendar.repository'),
    clientDashboardRepository:require('./client/dashboard.repository'),
    clientSettingsRepository:require('./client/settings.repository'),

    // employee repository
    employeeSettingsRepository:require('./employee/settings.repository'),
    employeeTaskRepository:require("./employee/task.repository"),
    employeeTaskMessageRepository:require("./employee/task-message.repository"),
    employeeTaskAttachmentRepository:require("./employee/task-attachment.repository"),
    employeeDashboardRepository:require("./employee/dashboard.repository"),

};