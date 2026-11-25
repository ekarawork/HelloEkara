"use strict";

const {
  Model
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class task_assignment extends Model {
    /**
     * Helper method for defining associations.
     */
    static associate(models) {

      // ========================= TASK =========================

      task_assignment.belongsTo(models.task, {
        foreignKey: "task_id",
        as: "task",
      });

      // ========================= EMPLOYEE =========================

      task_assignment.belongsTo(models.employee, {
        foreignKey: "employee_id",
        as: "employee",
      });

      // ========================= ASSIGNED BY =========================

      task_assignment.belongsTo(models.user, {
        foreignKey: "assigned_by",
        as: "assignedBy",
      });
    }
  }

  task_assignment.init(
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

      // ========================= EMPLOYEE =========================

      employee_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      // ========================= ASSIGNED BY =========================

      assigned_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      // ========================= ASSIGNED AT =========================

      assigned_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "task_assignment",
      tableName: "task_assignments",

      timestamps: true,

      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          name: "idx_task_assignments_uuid",
          fields: ["uuid"],
        },
        {
          name: "idx_task_assignments_task_id",
          fields: ["task_id"],
        },
        {
          name: "idx_task_assignments_employee_id",
          fields: ["employee_id"],
        },
        {
          name: "idx_task_assignments_assigned_by",
          fields: ["assigned_by"],
        },
        {
          name: "idx_task_assignments_task_employee",
          fields: ["task_id", "employee_id"],
          unique: true,
        },
      ],
    }
  );

  return task_assignment;
};