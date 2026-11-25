"use strict";

const ExcelJS = require("exceljs");

const {
    getPerformanceExportData,
    getPaymentExportData,
    getSocialCalendarExportData,
} = require("../../repositories/admin/export.repository");


/* =========================================================
   HELPERS
========================================================= */

const formatDate = (value) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date;
};


const formatText = (value) => {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value);
};


/* =========================================================
   HEADER STYLE
========================================================= */

const applyHeaderStyle = (row) => {
    row.font = {
        bold: true,
        color: {
            argb: "FFFFFFFF",
        },
    };

    row.alignment = {
        vertical: "middle",
        horizontal: "center",
    };

    row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FF2E3192",
        },
    };

    row.border = {
        top: {
            style: "thin",
            color: {
                argb: "FFD1D5DB",
            },
        },
        left: {
            style: "thin",
            color: {
                argb: "FFD1D5DB",
            },
        },
        bottom: {
            style: "thin",
            color: {
                argb: "FFD1D5DB",
            },
        },
        right: {
            style: "thin",
            color: {
                argb: "FFD1D5DB",
            },
        },
    };
};


/* =========================================================
   SECTION STYLE
========================================================= */

const addSectionTitle = (
    worksheet,
    title,
    rowNumber
) => {
    const row = worksheet.getRow(rowNumber);

    row.values = [title];

    worksheet.mergeCells(
        rowNumber,
        1,
        rowNumber,
        8
    );

    row.font = {
        bold: true,
        size: 13,
        color: {
            argb: "FF2E3192",
        },
    };

    row.alignment = {
        vertical: "middle",
        horizontal: "left",
    };

    row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: "FFEEF0FF",
        },
    };

    row.height = 24;
};


/* =========================================================
   BORDER
========================================================= */

const applyDataBorders = (row) => {
    row.eachCell((cell) => {
        cell.border = {
            top: {
                style: "thin",
                color: {
                    argb: "FFE5E7EB",
                },
            },
            left: {
                style: "thin",
                color: {
                    argb: "FFE5E7EB",
                },
            },
            bottom: {
                style: "thin",
                color: {
                    argb: "FFE5E7EB",
                },
            },
            right: {
                style: "thin",
                color: {
                    argb: "FFE5E7EB",
                },
            },
        };

        cell.alignment = {
            vertical: "middle",
        };
    });
};


/* =========================================================
   EXPORT EXCEL
========================================================= */

const generateAdminExport = async () => {
    /* =====================================================
       FETCH DATA
    ===================================================== */

    const [
        performanceRows,
        paymentRows,
        socialCalendarRows,
    ] = await Promise.all([
        getPerformanceExportData(),
        getPaymentExportData(),
        getSocialCalendarExportData(),
    ]);


    /* =====================================================
       WORKBOOK
    ===================================================== */

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Ekara Admin";
    workbook.lastModifiedBy = "Ekara Admin";
    workbook.created = new Date();
    workbook.modified = new Date();


    /* =====================================================
       WORKSHEET
    ===================================================== */

    const worksheet =
        workbook.addWorksheet(
            "Admin Export"
        );


    /* =====================================================
       WORKSHEET SETTINGS
    ===================================================== */

    worksheet.views = [
        {
            state: "frozen",
            ySplit: 1,
        },
    ];

    worksheet.pageSetup = {
        orientation: "landscape",
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
    };


    /* =====================================================
       DAILY DATA
    ===================================================== */

    addSectionTitle(
        worksheet,
        "DAILY DATA",
        1
    );

    const performanceHeader =
        worksheet.addRow([
            "Section",
            "Client",
            "Date",
            "Service",
            "Spend",
            "Impressions",
            "Clicks",
            "Leads",
        ]);

    applyHeaderStyle(
        performanceHeader
    );

    performanceRows.forEach(
        (performance) => {
            const row =
                worksheet.addRow([
                    "Daily Data",

                    formatText(
                        performance.client?.name
                    ),

                    formatDate(
                        performance.performance_date
                    ),

                    formatText(
                        performance.clientService
                            ?.service_name
                    ),

                    Number(
                        performance.daily_spend || 0
                    ),

                    Number(
                        performance.impressions || 0
                    ),

                    Number(
                        performance.clicks || 0
                    ),

                    Number(
                        performance.leads || 0
                    ),
                ]);

            applyDataBorders(row);

            row.getCell(3).numFmt =
                "dd-mm-yyyy";

            row.getCell(5).numFmt =
                '₹#,##0.00';
        }
    );


    /* =====================================================
       PAYMENTS
    ===================================================== */

    let paymentStartRow =
        worksheet.lastRow.number + 2;

    addSectionTitle(
        worksheet,
        "PAYMENTS",
        paymentStartRow
    );

    const paymentHeader =
        worksheet.addRow([
            "Section",
            "Client",
            "Payment Month",
            "Payment Amount",
            "Payment Status",
            "Due Date",
            "Paid At",
            "Reminders",
        ]);

    applyHeaderStyle(
        paymentHeader
    );

    paymentRows.forEach(
        (paymentData) => {
            const row =
                worksheet.addRow([
                    "Payments",

                    formatText(
                        paymentData.client?.name
                    ),

                    formatDate(
                        paymentData.payment_month
                    ),

                    Number(
                        paymentData.amount || 0
                    ),

                    formatText(
                        paymentData.status
                    ),

                    formatDate(
                        paymentData.due_date
                    ),

                    formatDate(
                        paymentData.paid_at
                    ),

                    paymentData.enable_reminders
                        ? "Enabled"
                        : "Disabled",
                ]);

            applyDataBorders(row);

            row.getCell(3).numFmt =
                "mmmm yyyy";

            row.getCell(4).numFmt =
                '₹#,##0.00';

            row.getCell(6).numFmt =
                "dd-mm-yyyy";

            row.getCell(7).numFmt =
                "dd-mm-yyyy";
        }
    );


    /* =====================================================
       SOCIAL CALENDAR
    ===================================================== */

    let socialStartRow =
        worksheet.lastRow.number + 2;

    addSectionTitle(
        worksheet,
        "SOCIAL CALENDAR",
        socialStartRow
    );

    const socialHeader =
        worksheet.addRow([
            "Section",
            "Client",
            "Date",
            "Platform",
            "Post Type",
            "Post Status",
            "Post Note",
            "UUID",
        ]);

    applyHeaderStyle(
        socialHeader
    );

    socialCalendarRows.forEach(
        (post) => {
            const postNote =
                post.post_note ??
                post.note ??
                post.caption ??
                "";

            const row =
                worksheet.addRow([
                    "Social Calendar",

                    formatText(
                        post.client?.name
                    ),

                    formatDate(
                        post.post_date
                    ),

                    formatText(
                        post.platform
                    ),

                    formatText(
                        post.content_type
                    ),

                    formatText(
                        post.status
                    ),

                    formatText(
                        postNote
                    ),

                    formatText(
                        post.uuid
                    ),
                ]);

            applyDataBorders(row);

            row.getCell(3).numFmt =
                "dd-mm-yyyy";
        }
    );


    /* =====================================================
       COLUMN WIDTHS
    ===================================================== */

    worksheet.columns = [
        {
            key: "section",
            width: 18,
        },
        {
            key: "client",
            width: 25,
        },
        {
            key: "date",
            width: 15,
        },
        {
            key: "service",
            width: 22,
        },
        {
            key: "spend",
            width: 16,
        },
        {
            key: "impressions",
            width: 16,
        },
        {
            key: "clicks",
            width: 14,
        },
        {
            key: "leads",
            width: 14,
        },
    ];


    /* =====================================================
       SPECIFIC COLUMN WIDTHS
    ===================================================== */

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 17;
    worksheet.getColumn(4).width = 22;
    worksheet.getColumn(5).width = 18;
    worksheet.getColumn(6).width = 18;
    worksheet.getColumn(7).width = 35;
    worksheet.getColumn(8).width = 38;


    /* =====================================================
       WRAP TEXT
    ===================================================== */

    worksheet.eachRow(
        {
            includeEmpty: true,
        },
        (row) => {
            row.eachCell(
                {
                    includeEmpty: true,
                },
                (cell) => {
                    cell.alignment = {
                        ...cell.alignment,
                        vertical: "middle",
                        wrapText: true,
                    };
                }
            );
        }
    );


    /* =====================================================
       AUTO FILTER
    ===================================================== */

    // Daily Data filter
    performanceHeader.autoFilter = {
        from: 1,
        to: 8,
    };


    /* =====================================================
       RETURN BUFFER
    ===================================================== */

    return await workbook.xlsx.writeBuffer();
};


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
    generateAdminExport,
};