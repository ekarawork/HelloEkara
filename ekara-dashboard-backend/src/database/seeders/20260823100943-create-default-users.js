"use strict";

require("dotenv").config();

const bcrypt = require("bcryptjs");
const logger = require("../../utils/winston.util");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const admin = {
      first_name: process.env.DEFAULT_SUPER_ADMIN_FIRST_NAME,
      last_name: process.env.DEFAULT_SUPER_ADMIN_LAST_NAME,
      email: process.env.DEFAULT_SUPER_ADMIN_EMAIL,
      password: process.env.DEFAULT_SUPER_ADMIN_PASSWORD,
      role: "SUPER_ADMIN",
    };

    /* ========================= Check Existing Admin ========================= */

    const [existingAdmin] =
      await queryInterface.sequelize.query(
        `
          SELECT id
          FROM users
          WHERE email = :email
          LIMIT 1
        `,
        {
          replacements: {
            email: admin.email,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

    if (existingAdmin) {
      logger.warn(
        `Super admin already exists: ${admin.email}. Seeder skipped.`
      );

      return;
    }

    /* ========================= Hash Password ========================= */

    const password = await bcrypt.hash(
      admin.password,
      12
    );

    /* ========================= Create Super Admin ========================= */

    await queryInterface.bulkInsert("users", [
      {
        uuid: Sequelize.literal("(UUID())"),
        first_name: admin.first_name,
        last_name: admin.last_name,
        email: admin.email,
        password,
        role: admin.role,
        status: "ACTIVE",
        last_login: null,
        failed_login_attempts: 0,
        locked_until: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    logger.info(
      `SUPER_ADMIN created successfully: ${admin.email}`
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: process.env.DEFAULT_SUPER_ADMIN_EMAIL,
      role: "SUPER_ADMIN",
    });

    logger.info(
      "Default SUPER_ADMIN deleted successfully."
    );
  },
};