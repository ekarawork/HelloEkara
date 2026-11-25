'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        // Payment belongs to Client
        payments.belongsTo(models.client, {
            foreignKey: "client_id",
            as: "client",
        });

        // Payment belongs to User who created it
        payments.belongsTo(models.user, {
            foreignKey: "created_by",
            as: "creator",
        });

        // Payment belongs to User who last updated it
        payments.belongsTo(models.user, {
            foreignKey: "updated_by",
            as: "updater",
        });

        // Payment has many reminders
        payments.hasMany(models.payment_reminder, {
            foreignKey: "payment_id",
            as: "reminders",
        });

        // Payment has many reminder logs
        payments.hasMany(models.payment_reminder_log, {
            foreignKey: "payment_id",
            as: "reminderLogs",
        });
    }
  }
  payments.init({
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
                unique: true,
            },
            client_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },

            payment_month: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            amount: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
            },

            due_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            status: {
                type: DataTypes.ENUM(
                    "due",
                    "paid",
                    "overdue"
                ),
                allowNull: false,
                defaultValue: "due",
            },

            paid_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            enable_reminders: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            created_by: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },

            updated_by: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "payment",
            tableName: "payments",
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            indexes: [
                {
                    name: "idx_payments_client_id",
                    fields: ["client_id"],
                },

                {
                    name: "idx_payments_payment_month",
                    fields: ["payment_month"],
                },

                {
                    name: "idx_payments_due_date",
                    fields: ["due_date"],
                },

                {
                    name: "idx_payments_status",
                    fields: ["status"],
                },

                {
                    name: "idx_payments_client_month",
                    fields: ["client_id", "payment_month"],
                },

                {
                    name: "idx_payments_status_due_date",
                    fields: ["status", "due_date"],
                },

                {
                    name: "idx_payments_reminders_due_date",
                    fields: ["enable_reminders", "due_date"],
                },
            ],
        }
    );
  return payments;
};