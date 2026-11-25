'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    notifications.belongsTo(models.user, {
      foreignKey: "user_id",
      as: "user",
    });
    }
  }
  notifications.init({
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

            user_id: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
            },

            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            type: {
                type: DataTypes.ENUM(
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
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            reference_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
            },

            is_read: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            read_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "notification",
            tableName: "notifications",
            timestamps: true,

            indexes: [
                {
                    name: "idx_notifications_user_id",
                    fields: ["user_id"],
                },

                {
                    name: "idx_notifications_is_read",
                    fields: ["is_read"],
                },

                {
                    name: "idx_notifications_type",
                    fields: ["type"],
                },

                {
                    name: "idx_notifications_reference",
                    fields: [
                        "reference_type",
                        "reference_id",
                    ],
                },

                {
                    name: "idx_notifications_user_read",
                    fields: [
                        "user_id",
                        "is_read",
                    ],
                },

                {
                    name: "idx_notifications_user_created",
                    fields: [
                        "user_id",
                        "createdAt",
                    ],
                },
            ],
        }
    );
  return notifications;
};