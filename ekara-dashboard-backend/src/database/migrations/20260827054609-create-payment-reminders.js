'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payment_reminders', {
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

            reminder_type: {
                type: Sequelize.ENUM(
                    "before",
                    "due_day",
                    "after"
                ),
                allowNull: false,
            },

            enabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            days_offset: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: null,
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            created_by: {
              type: Sequelize.BIGINT.UNSIGNED,
              allowNull: true,
              references: {
                model: "users",
                key: "id",
              },
              onUpdate: "CASCADE",
              onDelete: "SET NULL",
            },

            updated_by: {
              type: Sequelize.BIGINT.UNSIGNED,
              allowNull: true,
              references: {
                model: "users",
                key: "id",
              },
              onUpdate: "CASCADE",
              onDelete: "SET NULL",
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
            "payment_reminders",
            ["payment_id"],
            {
                name: "idx_payment_reminders_payment_id",
            }
        );

        await queryInterface.addIndex(
            "payment_reminders",
            ["reminder_type"],
            {
                name: "idx_payment_reminders_type",
            }
        );

        await queryInterface.addIndex(
            "payment_reminders",
            ["enabled"],
            {
                name: "idx_payment_reminders_enabled",
            }
        );

        await queryInterface.addIndex(
            "payment_reminders",
            ["payment_id", "reminder_type"],
            {
                name: "idx_payment_reminders_payment_type",
                unique: true,
            }
        );

        await queryInterface.addIndex(
            "payment_reminders",
            ["enabled", "reminder_type"],
            {
                name: "idx_payment_reminders_enabled_type",
            }
        );
    },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payment_reminders');
  }
};