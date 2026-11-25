"use strict";

const multer = require("multer");

/* =========================================================
   File Size Limits
========================================================= */

const MAX_IMAGE_SIZE =
    Number(process.env.MAX_IMAGE_SIZE);

const MAX_PDF_SIZE =
    Number(process.env.MAX_PDF_SIZE);

const MAX_TASK_ATTACHMENT_SIZE =
    10 * 1024 * 1024;

/* =========================================================
   Allowed Types
========================================================= */

const allowedImageTypes =
    String(
        process.env.ALLOWED_IMAGE_TYPES || ""
    )
        .split(",")
        .map((type) => type.trim())
        .filter(Boolean);

const allowedPdfTypes =
    String(
        process.env.ALLOWED_PDF_TYPES || ""
    )
        .split(",")
        .map((type) => type.trim())
        .filter(Boolean);

/* =========================================================
   Safe Existing Upload Limit
========================================================= */

const safeImageSize =
    Number.isFinite(MAX_IMAGE_SIZE) &&
    MAX_IMAGE_SIZE > 0
        ? MAX_IMAGE_SIZE
        : MAX_TASK_ATTACHMENT_SIZE;

const safePdfSize =
    Number.isFinite(MAX_PDF_SIZE) &&
    MAX_PDF_SIZE > 0
        ? MAX_PDF_SIZE
        : MAX_TASK_ATTACHMENT_SIZE;

const MAX_UPLOAD_SIZE =
    Math.max(
        safeImageSize,
        safePdfSize,
        MAX_TASK_ATTACHMENT_SIZE
    );

/* =========================================================
   Multer
========================================================= */

const upload = multer({

    storage: multer.memoryStorage(),

    limits: {
        fileSize: MAX_UPLOAD_SIZE,
    },

    fileFilter(req, file, cb) {

        /* =====================================================
           Profile Image / Profile Photo
        ===================================================== */

        if (
            file.fieldname === "profile_image" ||
            file.fieldname === "profile_photo"
        ) {
            if (
                !allowedImageTypes.includes(
                    file.mimetype
                )
            ) {
                return cb(
                    new Error(
                        "Only JPG, PNG and WEBP images are allowed for profile image."
                    )
                );
            }

            return cb(null, true);
        }

        /* =====================================================
           Agreement Contract
        ===================================================== */

        if (
            file.fieldname === "agreement_contract"
        ) {
            if (
                !allowedPdfTypes.includes(
                    file.mimetype
                )
            ) {
                return cb(
                    new Error(
                        "Only PDF files are allowed for agreement contract."
                    )
                );
            }

            return cb(null, true);
        }

        /* =====================================================
           Task Attachment
        ===================================================== */

        if (
            file.fieldname === "attachment"
        ) {
            const allowedTaskAttachmentTypes = [
                ...allowedImageTypes,
                ...allowedPdfTypes,

                "application/msword",

                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

                "application/vnd.ms-excel",

                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                "text/plain",

                "video/mp4",
                "video/webm",
                "video/quicktime",
            ];

            if (
                !allowedTaskAttachmentTypes.includes(
                    file.mimetype
                )
            ) {
                return cb(
                    new Error(
                        "Unsupported task attachment file type."
                    )
                );
            }

            return cb(null, true);
        }

        /* =====================================================
           Unexpected File Field
        ===================================================== */

        return cb(
            new Error(
                `Unexpected file field: ${file.fieldname}`
            )
        );
    },
});

module.exports = upload;