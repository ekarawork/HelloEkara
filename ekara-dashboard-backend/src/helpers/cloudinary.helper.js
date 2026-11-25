const cloudinary = require("../database/config/cloudinary");

const uploadToCloudinary = (file, options = {}) => {
    return new Promise((resolve, reject) => {
        try {
            if (!file) {
                return reject(
                    new Error("Cloudinary upload received no file.")
                );
            }

            if (!file.buffer) {
                return reject(
                    new Error("Cloudinary upload received no buffer.")
                );
            }

            if (!Buffer.isBuffer(file.buffer)) {
                return reject(
                    new Error("Cloudinary upload buffer is not a Buffer.")
                );
            }

            if (file.buffer.length === 0) {
                return reject(
                    new Error("Cloudinary upload buffer is empty.")
                );
            }

            const isPdf =
                file.mimetype === "application/pdf";

            const resourceType =
                isPdf
                    ? "image"
                    : options.resourceType || "auto";

            console.log("========== CLOUDINARY UPLOAD ==========");
            console.log("File name:", file.originalname);
            console.log("MIME type:", file.mimetype);
            console.log("File size:", file.size);
            console.log("Buffer size:", file.buffer.length);
            console.log("Resource type:", resourceType);
            console.log("========================================");

            /*
             * ==================================================
             * RAW FILES
             * ==================================================
             *
             * Cloudinary raw files need the file extension
             * in the public_id.
             *
             * Example:
             * report.xlsx
             *     ↓
             * random-id.xlsx
             */
            let publicId;

            if (resourceType === "raw") {
                const originalName =
                    file.originalname || "file";

                const lastDotIndex =
                    originalName.lastIndexOf(".");

                const extension =
                    lastDotIndex !== -1
                        ? originalName
                              .substring(lastDotIndex)
                              .toLowerCase()
                        : "";

                const randomId =
                    `${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2, 10)}`;

                publicId = `${randomId}${extension}`;

                console.log(
                    "Raw file public ID:",
                    publicId
                );
            }

            const uploadOptions = {
                folder:
                    options.folder ||
                    "hello_ekara",

                resource_type: resourceType,

                ...(publicId && {
                    public_id: publicId,
                }),
            };

            const uploadStream =
                cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            console.error(
                                "CLOUDINARY UPLOAD ERROR:",
                                error
                            );

                            return reject(error);
                        }

                        console.log(
                            "Cloudinary upload successful:",
                            result?.secure_url
                        );

                        console.log(
                            "Cloudinary public ID:",
                            result?.public_id
                        );

                        console.log(
                            "Cloudinary resource type:",
                            result?.resource_type
                        );

                        resolve(result);
                    }
                );

            uploadStream.end(file.buffer);
        } catch (error) {
            reject(error);
        }
    });
};

const getCloudinaryPublicId = (url) => {
    if (!url) return null;

    try {
        if (!url.includes("res.cloudinary.com")) {
            return null;
        }

        const uploadIndex = url.indexOf("/upload/");

        if (uploadIndex === -1) {
            return null;
        }

        let publicId = url.substring(
            uploadIndex + "/upload/".length
        );

        const parts = publicId.split("/");

        if (parts[0].startsWith("v") && /^v\d+$/.test(parts[0])) {
            parts.shift();
        }

        publicId = parts.join("/");

        publicId = publicId.replace(/\.[^/.]+$/, "");

        return publicId;
    } catch (error) {
        console.error(
            "CLOUDINARY PUBLIC ID ERROR:",
            error.message
        );

        return null;
    }
};


const deleteFromCloudinary = async (
    publicId,
    resourceType = "image"
) => {
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
    } catch (error) {
        console.error(
            "CLOUDINARY DELETE ERROR:",
            error.message
        );
    }
};


const deleteCloudinaryFile = async (
    url,
    resourceType = "image"
) => {
    const publicId = getCloudinaryPublicId(url);

    if (!publicId) return;

    await deleteFromCloudinary(
        publicId,
        resourceType
    );
};


module.exports = {
    uploadToCloudinary,
    getCloudinaryPublicId,
    deleteFromCloudinary,
    deleteCloudinaryFile,
};