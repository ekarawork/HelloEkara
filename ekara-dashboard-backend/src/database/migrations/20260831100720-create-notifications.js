'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
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

            user_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            type: {
                type: Sequelize.ENUM(
                    "PAYMENT_REMINDER",
                    "PAYMENT",
                    "CLIENT",
                    "SOCIAL_CALENDAR",
                    "SYSTEM"
                ),
                allowNull: false,
                defaultValue: "SYSTEM",
            },

            reference_type: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },

            reference_id: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: true,
            },

            is_read: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            read_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP"
                ),
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                ),
            },
        });

        /* =========================
           INDEXES
        ========================= */

        await queryInterface.addIndex(
            "notifications",
            ["user_id"],
            {
                name: "idx_notifications_user_id",
            }
        );

        await queryInterface.addIndex(
            "notifications",
            ["is_read"],
            {
                name: "idx_notifications_is_read",
            }
        );

        await queryInterface.addIndex(
            "notifications",
            ["type"],
            {
                name: "idx_notifications_type",
            }
        );

        await queryInterface.addIndex(
            "notifications",
            ["reference_type", "reference_id"],
            {
                name: "idx_notifications_reference",
            }
        );

        await queryInterface.addIndex(
            "notifications",
            ["user_id", "is_read"],
            {
                name: "idx_notifications_user_read",
            }
        );

        await queryInterface.addIndex(
            "notifications",
            ["user_id", "createdAt"],
            {
                name: "idx_notifications_user_created",
            }
        );
    },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};