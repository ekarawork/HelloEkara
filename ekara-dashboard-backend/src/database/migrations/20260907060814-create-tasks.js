'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
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

      // ========================= TASK CODE =========================

      task_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      // ========================= BASIC INFORMATION =========================

      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // ========================= CLIENT =========================

      client_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "clients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      // ========================= PRIORITY =========================

      priority: {
        type: Sequelize.ENUM(
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
        type: Sequelize.ENUM(
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
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      // ========================= ESTIMATION =========================

      estimated_hours: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },

      // ========================= PROGRESS =========================

      progress: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // ========================= COMPLETION =========================

      completed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      // ========================= AUDIT =========================

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

      // ========================= SOFT DELETE =========================

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addIndex("tasks", ["uuid"], {
      name: "idx_tasks_uuid",
    });

    await queryInterface.addIndex("tasks", ["task_code"], {
      name: "idx_tasks_task_code",
    });

    await queryInterface.addIndex("tasks", ["client_id"], {
      name: "idx_tasks_client_id",
    });

    await queryInterface.addIndex("tasks", ["priority"], {
      name: "idx_tasks_priority",
    });

    await queryInterface.addIndex("tasks", ["status"], {
      name: "idx_tasks_status",
    });

    await queryInterface.addIndex("tasks", ["start_date"], {
      name: "idx_tasks_start_date",
    });

    await queryInterface.addIndex("tasks", ["due_date"], {
      name: "idx_tasks_due_date",
    });

    await queryInterface.addIndex("tasks", ["created_by"], {
      name: "idx_tasks_created_by",
    });

    await queryInterface.addIndex("tasks", ["updated_by"], {
      name: "idx_tasks_updated_by",
    });

    await queryInterface.addIndex("tasks", ["deleted_at"], {
      name: "idx_tasks_deleted_at",
    });

    await queryInterface.addIndex("tasks", ["client_id", "status"], {
      name: "idx_tasks_client_status",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};