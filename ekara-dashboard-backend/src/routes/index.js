const express = require("express");
const router = express.Router();

// admin routes
const adminRoutes = require("./api/v1/admin/auth.routes");
const adminClientRoutes = require("./api/v1/admin/client.routes");
const adminPerformanceRoutes = require("./api/v1/admin/clientPerformance.routes");
const adminPaymentRoutes = require("./api/v1/admin/payment.routes");
const adminPaymentReminderLogRoutes = require("./api/v1/admin/paymentReminderLog.routes");
const adminNotificationRoute = require("./api/v1/admin/notification.route");
const adminSocialCalendarRoute = require("./api/v1/admin/socialCalendar.route");
const settingsRoute = require("./api/v1/admin/settings.route");
const exportRoute = require("./api/v1/admin/export.route");
const adminEmployeeRoute = require("./api/v1/admin/employee.routes");
const adminTaskRoutes = require("./api/v1/admin/task.route");
const adminTaskMessageRoutes = require("./api/v1/admin/task.message.route");
const taskAttachmentRoute = require("./api/v1/admin/task.attachment.route");
const adminDashboardRoute = require("./api/v1/admin/dashboard.routes");
const clientPortalRoute = require("./api/v1/admin/clientPortal.route");

// client routes
const clientmetaadsPerformanceRoutes = require("./api/v1/client/metaadsPerformance.route");
const clientGoogleAdsPerformanceRoutes = require("./api/v1/client/googleadsPerformance.route");
const clientleadsRoutes = require("./api/v1/client/leads.route");
const clientPaymentRoutes = require("./api/v1/client/payments.route");
const clientSocialCalendarRoutes = require("./api/v1/client/socialCalendar.route");
const clientDashboardRoutes = require("./api/v1/client/dashboard.route");
const clientSettingRoutes = require("./api/v1/client/settings.routes");

// employee routes
const employeeSettingRoutes = require("./api/v1/employee/settings.routes");
const employeeTaskRoutes = require("./api/v1/employee/task.routes");
const employeeTaskMessageRoutes = require("./api/v1/employee/task-message.routes");
const employeeTaskAttachmentRoutes = require("./api/v1/employee/task-attachment.routes");
const employeeDashboardRoutes = require("./api/v1/employee/dashboard.routes");

// admin routes
router.use("/admin/auth", adminRoutes);
router.use("/admin/client", adminClientRoutes);
router.use("/admin/client-performance", adminPerformanceRoutes);
router.use("/admin/payments", adminPaymentRoutes);
router.use("/admin/payment-reminder-log", adminPaymentReminderLogRoutes);
router.use("/admin/notifications",adminNotificationRoute);
router.use("/admin/social-calendar", adminSocialCalendarRoute);
router.use("/settings", settingsRoute);
router.use("/admin/export", exportRoute);
router.use("/admin/employee", adminEmployeeRoute);
router.use("/admin/task", adminTaskRoutes);
router.use("/admin/task", adminTaskMessageRoutes);
router.use("/admin/task", taskAttachmentRoute);
router.use("/admin/dashboard", adminDashboardRoute);
router.use("/admin/client-portal", clientPortalRoute);

// client routes
router.use("/client", clientmetaadsPerformanceRoutes);
router.use("/client", clientGoogleAdsPerformanceRoutes);
router.use("/client", clientleadsRoutes);
router.use("/client", clientPaymentRoutes);
router.use("/client", clientSocialCalendarRoutes);
router.use("/client", clientDashboardRoutes);
router.use("/client/settings", clientSettingRoutes);

// employee routes
router.use("/employee/settings", employeeSettingRoutes);
router.use("/employee/tasks", employeeTaskRoutes);
router.use("/employee", employeeTaskMessageRoutes);
router.use("/employee", employeeTaskAttachmentRoutes);
router.use("/employee/dashboard", employeeDashboardRoutes);

module.exports = router;