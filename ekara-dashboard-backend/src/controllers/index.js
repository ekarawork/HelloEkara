// admin controller
const authController = require('./admin/auth.controller');
const adminClientController = require('./admin/client.controller');
const adminClientPerformanceController = require("./admin/clientPerformance.controller");
const adminPaymentController = require("./admin/payment.controller");
const adminPaymentReminderLogController = require("./admin/paymentReminderLog.controller");
const adminNotificationController = require("./admin/notification.controller");
const adminSocialCalendarController = require("./admin/socialCalendar.controller");
const settingsController = require("./admin/settings.controller");
const exportController = require("./admin/export.controller");
const adminEmployeeController = require("./admin/employee.controller");
const adminTaskController = require("./admin/task.controller");
const adminTaskMessageController = require("./admin/task.message.controller");
const adminTaskAttachmentController = require("./admin/task.attachment.controller");
const adminDashboardController = require("./admin/dashboard.controller");
const clientPortalController = require("./admin/clientPortal.controller");

// client controller
const clientmetaadsPerformanceController = require("./client/metaadsPerformance.controller");
const clientGoogleAdsPerformanceController = require("./client/googleadsPerformance.controller");
const clientLeadsController = require("./client/leads.controller");
const clientPaymentsController = require("./client/payments.controller");
const clientSocialCalendarController = require("./client/socialCalendar.controller");
const clientDashboardController = require("./client/dashboard.controller");
const clientSettingsController = require("./client/settings.controller");

// employee controller
const employeeSettingsController = require("./employee/settings.controller");
const employeeTaskController = require("./employee/task.controller");
const employeeTaskMessageController = require("./employee/task-message.controller");
const employeeTaskAttachmentController = require("./employee/task-attachment.controller");
const employeeDashboardController = require("./employee/dashboard.controller");

module.exports = {

    // admin controller
    authController:require('./admin/auth.controller'),
    adminClientController:require('./admin/client.controller'),
    adminClientPerformanceController:require('./admin/clientPerformance.controller'),
    adminPaymentController:require('./admin/payment.controller'),
    adminPaymentReminderLogController:require('./admin/paymentReminderLog.controller'),
    adminNotificationController:require('./admin/notification.controller'),
    adminSocialCalendarController:require('./admin/socialCalendar.controller'),
    settingsController:require('./admin/settings.controller'),
    exportController:require('./admin/export.controller'),
    adminEmployeeController:require('./admin/employee.controller'),
    adminTaskController:require('./admin/task.controller'),
    adminTaskMessageController:require('./admin/task.message.controller'),
    adminTaskAttachmentController:require('./admin/task.attachment.controller'),
    adminDashboardController:require('./admin/dashboard.controller'),
    clientPortalController:require('./admin/clientPortal.controller'),

    // client controller
    clientmetaadsPerformanceController:require('./client/metaadsPerformance.controller'),
    clientGoogleAdsPerformanceController:require('./client/googleadsPerformance.controller'),
    clientLeadsController:require('./client/leads.controller'),
    clientPaymentsController:require('./client/payments.controller'),
    clientSocialCalendarController:require('./client/socialCalendar.controller'),
    clientDashboardController:require('./client/dashboard.controller'),
    clientSettingsController:require('./client/settings.controller'),

    // employee controller
    employeeSettingsController:require('./employee/settings.controller'),
    employeeTaskController:require('./employee/task.controller'),
    employeeTaskMessageController:require('./employee/task-message.controller'),
    employeeTaskAttachmentController:require('./employee/task-attachment.controller'),
    employeeDashboardController:require('./employee/dashboard.controller'),
};