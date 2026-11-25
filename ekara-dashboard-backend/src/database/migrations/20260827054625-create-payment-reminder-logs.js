'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_reminder_logs', {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            uuid: {
                type: Sequelize.UUID,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
                unique: true,
            },
            payment_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "payments",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },

            payment_reminder_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "payment_reminders",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },

            scheduled_for: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            sent_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            status: {
                type: Sequelize.ENUM(
                    "pending",
                    "sent",
                    "failed"
                ),
                allowNull: false,
                defaultValue: "pending",
            },

            channel: {
                type: Sequelize.ENUM(
                    "email",
                    "whatsapp",
                    "sms",
                    "website"
                ),
                allowNull: true,
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            error_message: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

            createdAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            updatedAt: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal(
                "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
              ),
            },
        });

        // ========================= INDEXES =========================

        await queryInterface.addIndex(
            "payment_reminder_logs",
            ["payment_id"],
            {
                name: "idx_payment_reminder_logs_payment_id",
            }
        );

        await queryInterface.addIndex(
            "payment_reminder_logs",
            ["payment_reminder_id"],
            {
                name: "idx_payment_reminder_logs_reminder_id",
            }
        );

        await queryInterface.addIndex(
            "payment_reminder_logs",
            ["scheduled_for"],
            {
                name: "idx_payment_reminder_logs_scheduled_for",
            }
        );

        await queryInterface.addIndex(
            "payment_reminder_logs",
            ["status"],
            {
                name: "idx_payment_reminder_logs_status",
            }
        );

        await queryInterface.addIndex(
            "payment_reminder_logs",
            ["status", "scheduled_for"],
            {
                name: "idx_payment_reminder_logs_status_scheduled",
            }
        );

        await queryInterface.addIndex(
            "payment_reminder_logs",
            ["payment_reminder_id", "scheduled_for"],
            {
                name: "idx_payment_reminder_logs_reminder_scheduled",
                unique: true,
            }
        );

        await queryInterface.addIndex(
            "payment_reminder_logs",
            ["channel"],
            {
                name: "idx_payment_reminder_logs_channel",
            }
        );
    },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payment_reminder_logs');
  }
};