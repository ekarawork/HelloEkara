'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_assignments', {
      // ========================= PRIMARY KEY =========================

      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      // ========================= UUID =========================

      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },

      // ========================= TASK =========================

      task_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "tasks",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // ========================= EMPLOYEE =========================

      employee_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // ========================= ASSIGNED BY =========================

      assigned_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      // ========================= ASSIGNMENT TIME =========================

      assigned_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      // ========================= TIMESTAMPS =========================

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

    await queryInterface.addIndex(
      "task_assignments",
      ["uuid"],
      {
        name: "idx_task_assignments_uuid",
      }
    );

    await queryInterface.addIndex(
      "task_assignments",
      ["task_id"],
      {
        name: "idx_task_assignments_task_id",
      }
    );

    await queryInterface.addIndex(
      "task_assignments",
      ["employee_id"],
      {
        name: "idx_task_assignments_employee_id",
      }
    );

    await queryInterface.addIndex(
      "task_assignments",
      ["assigned_by"],
      {
        name: "idx_task_assignments_assigned_by",
      }
    );

    await queryInterface.addIndex(
      "task_assignments",
      ["task_id", "employee_id"],
      {
        name: "idx_task_assignments_task_employee",
        unique: true,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_assignments');
  }
};