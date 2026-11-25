'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment_reminders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
        // Reminder belongs to Payment
        payment_reminders.belongsTo(models.payment, {
            foreignKey: "payment_id",
            as: "payment",
        });

        // Reminder belongs to User who created it
        payment_reminders.belongsTo(models.user, {
            foreignKey: "created_by",
            as: "creator",
        });

        // Reminder belongs to User who last updated it
        payment_reminders.belongsTo(models.user, {
            foreignKey: "updated_by",
            as: "updater",
        });

        // Reminder has many logs
        payment_reminders.hasMany(models.payment_reminder_log, {
            foreignKey: "payment_reminder_id",
            as: "logs",
        });
    }
  }
  payment_reminders.init({
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

            reminder_type: {
                type: DataTypes.ENUM(
                    "before",
                    "due_day",
                    "after"
                ),
                allowNull: false,
            },

            enabled: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },

            days_offset: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
            },

            message: {
                type: DataTypes.TEXT,
                allowNull: false,
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
            modelName: "payment_reminder",
            tableName: "payment_reminders",
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            indexes: [
                {
                    name: "idx_payment_reminders_payment_id",
                    fields: ["payment_id"],
                },

                {
                    name: "idx_payment_reminders_type",
                    fields: ["reminder_type"],
                },

                {
                    name: "idx_payment_reminders_enabled",
                    fields: ["enabled"],
                },

                {
                    name: "idx_payment_reminders_payment_type",
                    unique: true,
                    fields: ["payment_id", "reminder_type"],
                },

                {
                    name: "idx_payment_reminders_enabled_type",
                    fields: ["enabled", "reminder_type"],
                },

            ],
        }
    );
  return payment_reminders;
};