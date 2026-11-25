"use strict";

const {
  Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class task_attachment extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {

      // ========================= TASK =========================

      task_attachment.belongsTo(models.task, {
        foreignKey: "task_id",
        as: "task",
      });

      // ========================= MESSAGE =========================

      task_attachment.belongsTo(models.task_message, {
        foreignKey: "message_id",
        as: "message",
      });

      // ========================= UPLOADED BY =========================

      task_attachment.belongsTo(models.user, {
        foreignKey: "uploaded_by",
        as: "uploadedBy",
      });
    }
  }

  task_attachment.init(
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

      // ========================= MESSAGE =========================

      message_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      // ========================= UPLOADED BY =========================

      uploaded_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      // ========================= FILE INFORMATION =========================

      file_url: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },

      file_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      file_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      file_size: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      resource_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "task_attachment",
      tableName: "task_attachments",

      timestamps: true,

      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          name: "idx_task_attachments_uuid",
          fields: ["uuid"],
        },
        {
          name: "idx_task_attachments_task_id",
          fields: ["task_id"],
        },
        {
          name: "idx_task_attachments_message_id",
          fields: ["message_id"],
        },
        {
          name: "idx_task_attachments_uploaded_by",
          fields: ["uploaded_by"],
        },
        {
          name: "idx_task_attachments_file_type",
          fields: ["file_type"],
        },
      ],
    }
  );

  return task_attachment;
};