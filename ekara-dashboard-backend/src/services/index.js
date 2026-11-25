// admin service
const authService = require('./admin/auth.service');
const adminClientService = require('./admin/client.service');
const adminClientPerformanceService = require('./admin/clientPerformance.service');
const adminPaymentService = require("./admin/payment.service");
const adminPaymentReminderLogService = require("./admin/paymentReminderLog.service");
const adminNotificationService = require("./admin/notification.service");
const paymentReminderSchedulerService = require("./admin/paymentReminderScheduler.service");
const adminSocialCalendarService = require("./admin/socialCalendar.service");
const settingsService = require("./admin/settings.service");
const exportService = require("./admin/export.service");
const adminEmployeeService = require("./admin/employee.service");
const adminTaskService = require("./admin/task.service");
const adminTaskMessageService = require("./admin/task.message.service");
const adminTaskAttachmentService = require("./admin/task.attachment.service");
const adminDashboardService = require("./admin/dashboard.service");
const clientPortalService = require("./admin/clientPortal.service");

// client service
const clientmetaadsPerformanceService = require("./client/metaadsPerformance.service");
const clientGoogleAdsPerformanceService = require("./client/googleadsPerformance.service");
const clientLeadsService = require("./client/leads.service");
const clientPaymentsService = require("./client/payments.service");
const clientSocialCalendarService = require("./client/socialCalendar.service");
const clientDashboardService = require("./client/dashboard.service");
const clientSettingsService = require("./client/settings.service");

// employee service
const employeeSettingsService = require("./employee/settings.service");
const employeeTaskService = require("./employee/task.service");
const employeeTaskMessageService = require("./employee/task-message.service");
const employeeTaskAttachmentService = require("./employee/task-attachment.service");
const employeeDashboardService = require("./employee/dashboard.service");

module.exports = {

    // admin service
    authService:require('./admin/auth.service'),
    adminClientService:require('./admin/client.service'),
    adminClientPerformanceService:require('./admin/clientPerformance.service'),
    adminPaymentService:require('./admin/payment.service'),
    adminPaymentReminderLogService:require('./admin/paymentReminderLog.service'),
    adminNotificationService:require('./admin/notification.service'),
    paymentReminderSchedulerService:require('./admin/paymentReminderScheduler.service'),
    adminSocialCalendarService:require('./admin/socialCalendar.service'),
    settingsService:require('./admin/settings.service'),
    exportService:require('./admin/export.service'),
    adminEmployeeService:require('./admin/employee.service'),
    adminTaskService:require('./admin/task.service'),
    adminTaskMessageService:require('./admin/task.message.service'),
    adminTaskAttachmentService:require('./admin/task.attachment.service'),
    adminDashboardService:require('./admin/dashboard.service'),
    clientPortalService:require('./admin/clientPortal.service'),

    // client service
    clientmetaadsPerformanceService:require('./client/metaadsPerformance.service'),
    clientGoogleAdsPerformanceService:require('./client/googleadsPerformance.service'),
    clientLeadsService:require('./client/leads.service'),
    clientPaymentsService:require('./client/payments.service'),
    clientSocialCalendarService:require('./client/socialCalendar.service'),
    clientDashboardService:require('./client/dashboard.service'),
    clientSettingsService:require('./client/settings.service'),

    // employee service
    employeeSettingsService:require('./employee/settings.service'),
    employeeTaskService: require("./employee/task.service"),
    employeeTaskMessageService: require("./employee/task-message.service"),
    employeeTaskAttachmentService: require("./employee/task-attachment.service"),
    employeeDashboardService:require("./employee/dashboard.service"),
};