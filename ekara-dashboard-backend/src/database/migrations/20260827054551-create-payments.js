'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
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

            client_id: {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: false,
                references: {
                    model: "clients",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },

            payment_month: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },

            amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
            },

            due_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },

            status: {
                type: Sequelize.ENUM(
                    "due",
                    "paid",
                    "overdue"
                ),
                allowNull: false,
                defaultValue: "due",
            },

            paid_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },

            enable_reminders: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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

        await queryInterface.addIndex("payments", ["client_id"], {
            name: "idx_payments_client_id",
        });

        await queryInterface.addIndex("payments", ["payment_month"], {
            name: "idx_payments_payment_month",
        });

        await queryInterface.addIndex("payments", ["due_date"], {
            name: "idx_payments_due_date",
        });

        await queryInterface.addIndex("payments", ["status"], {
            name: "idx_payments_status",
        });

        await queryInterface.addIndex(
            "payments",
            ["client_id", "payment_month"],
            {
                name: "idx_payments_client_month",
            }
        );

        await queryInterface.addIndex(
            "payments",
            ["status", "due_date"],
            {
                name: "idx_payments_status_due_date",
            }
        );

        await queryInterface.addIndex(
            "payments",
            ["enable_reminders", "due_date"],
            {
                name: "idx_payments_reminders_due_date",
            }
        );

    },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};