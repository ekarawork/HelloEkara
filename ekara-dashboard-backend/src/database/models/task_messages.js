"use strict";

const {
  Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class task_message extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {

      // ========================= TASK =========================

      task_message.belongsTo(models.task, {
        foreignKey: "task_id",
        as: "task",
      });

      // ========================= SENDER =========================

      task_message.belongsTo(models.user, {
        foreignKey: "sender_id",
        as: "sender",
      });

      // ========================= ATTACHMENTS =========================

      task_message.hasMany(models.task_attachment, {
        foreignKey: "message_id",
        as: "attachments",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }

  task_message.init(
    {
      // ========================= PRIMARY KEY =========================

      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      // ========================= UUID =========================

      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },

      // ========================= TASK =========================

      task_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      // ========================= SENDER =========================

      sender_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      // ========================= SENDER TYPE =========================

      sender_type: {
        type: DataTypes.ENUM(
          "ADMIN",
          "EMPLOYEE"
        ),
        allowNull: false,
      },

      // ========================= MESSAGE =========================

      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      // ========================= MESSAGE TYPE =========================

      message_type: {
        type: DataTypes.ENUM(
          "TEXT",
          "TASK",
          "SYSTEM"
        ),
        allowNull: false,
        defaultValue: "TEXT",
      },
    },
    {
      sequelize,
      modelName: "task_message",
      tableName: "task_messages",

      timestamps: true,

      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          name: "idx_task_messages_uuid",
          fields: ["uuid"],
        },
        {
          name: "idx_task_messages_task_id",
          fields: ["task_id"],
        },
        {
          name: "idx_task_messages_sender_id",
          fields: ["sender_id"],
        },
        {
          name: "idx_task_messages_sender_type",
          fields: ["sender_type"],
        },
        {
          name: "idx_task_messages_message_type",
          fields: ["message_type"],
        },
        {
          name: "idx_task_messages_task_created",
          fields: ["task_id", "createdAt"],
        },
      ],
    }
  );

  return task_message;
};