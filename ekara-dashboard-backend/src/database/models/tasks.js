"use strict";

const {
  Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {

      // ========================= CLIENT =========================

      task.belongsTo(models.client, {
        foreignKey: "client_id",
        as: "client",
      });

      // ========================= CREATED BY =========================

      task.belongsTo(models.user, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // ========================= UPDATED BY =========================

      task.belongsTo(models.user, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });

      // ========================= ASSIGNMENTS =========================

      task.hasMany(models.task_assignment, {
        foreignKey: "task_id",
        as: "assignments",
        onDelete: "CASCADE",
        hooks: true,
      });

      // ========================= MESSAGES =========================

      task.hasMany(models.task_message, {
        foreignKey: "task_id",
        as: "messages",
        onDelete: "CASCADE",
        hooks: true,
      });

      // ========================= ATTACHMENTS =========================

      task.hasMany(models.task_attachment, {
        foreignKey: "task_id",
        as: "attachments",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }

  task.init(
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

      // ========================= TASK CODE =========================

      task_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      // ========================= BASIC INFORMATION =========================

      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // ========================= CLIENT =========================

      client_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      // ========================= PRIORITY =========================

      priority: {
        type: DataTypes.ENUM(
          "LOW",
          "MEDIUM",
          "HIGH",
          "URGENT"
        ),
        allowNull: false,
        defaultValue: "MEDIUM",
      },

      // ========================= STATUS =========================

      status: {
        type: DataTypes.ENUM(
          "TODO",
          "IN_PROGRESS",
          "IN_REVIEW",
          "COMPLETED"
        ),
        allowNull: false,
        defaultValue: "TODO",
      },

      // ========================= SCHEDULE =========================

      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      // ========================= ESTIMATION =========================

      estimated_hours: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },

      // ========================= PROGRESS =========================

      progress: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // ========================= COMPLETION =========================

      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // ========================= AUDIT =========================

      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      // ========================= SOFT DELETE =========================

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "task",
      tableName: "tasks",

      timestamps: true,

      paranoid: true,
      deletedAt: "deleted_at",

      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          name: "idx_tasks_uuid",
          fields: ["uuid"],
        },
        {
          name: "idx_tasks_task_code",
          fields: ["task_code"],
        },
        {
          name: "idx_tasks_client_id",
          fields: ["client_id"],
        },
        {
          name: "idx_tasks_priority",
          fields: ["priority"],
        },
        {
          name: "idx_tasks_status",
          fields: ["status"],
        },
        {
          name: "idx_tasks_start_date",
          fields: ["start_date"],
        },
        {
          name: "idx_tasks_due_date",
          fields: ["due_date"],
        },
        {
          name: "idx_tasks_created_by",
          fields: ["created_by"],
        },
        {
          name: "idx_tasks_updated_by",
          fields: ["updated_by"],
        },
        {
          name: "idx_tasks_deleted_at",
          fields: ["deleted_at"],
        },
        {
          name: "idx_tasks_client_status",
          fields: ["client_id", "status"],
        },
      ],
    }
  );

  return task;
};