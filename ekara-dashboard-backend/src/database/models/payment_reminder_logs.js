'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment_reminder_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        // Log belongs to Payment
        payment_reminder_logs.belongsTo(models.payment, {
            foreignKey: "payment_id",
            as: "payment",
        });

        // Log belongs to Reminder
        payment_reminder_logs.belongsTo(models.payment_reminder, {
            foreignKey: "payment_reminder_id",
            as: "paymentReminder",
        });
    }
  }
  payment_reminder_logs.init({
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
            payment_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },

            payment_reminder_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },

            scheduled_for: {
                type: DataTypes.DATE,
                allowNull: false,
            },

            sent_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            status: {
                type: DataTypes.ENUM(
                    "pending",
                    "sent",
                    "failed"
                ),
                allowNull: false,
                defaultValue: "pending",
            },

            channel: {
                type: DataTypes.ENUM(
                    "email",
                    "whatsapp",
                    "sms",
                    "website"
                ),
                allowNull: true,
            },

            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            error_message: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "payment_reminder_log",
            tableName: "payment_reminder_logs",
            timestamps: true,
            indexes: [
                {
                    name: "idx_payment_reminder_logs_payment_id",
                    fields: ["payment_id"],
                },

                {
                    name: "idx_payment_reminder_logs_reminder_id",
                    fields: ["payment_reminder_id"],
                },

                {
                    name: "idx_payment_reminder_logs_scheduled_for",
                    fields: ["scheduled_for"],
                },

                {
                    name: "idx_payment_reminder_logs_status",
                    fields: ["status"],
                },

                {
                    name: "idx_payment_reminder_logs_status_scheduled",
                    fields: ["status", "scheduled_for"],
                },

                {
                    name: "idx_payment_reminder_logs_reminder_scheduled",
                    unique: true,
                    fields: ["payment_reminder_id", "scheduled_for"],
                },

                {
                    name: "idx_payment_reminder_logs_channel",
                    fields: ["channel"],
                },
            ],
        }
    );
  return payment_reminder_logs;
};