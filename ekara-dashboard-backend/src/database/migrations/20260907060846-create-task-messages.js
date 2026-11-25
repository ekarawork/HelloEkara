'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_messages', {
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

      // ========================= SENDER =========================

      sender_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // ========================= SENDER TYPE =========================

      sender_type: {
        type: Sequelize.ENUM(
          "ADMIN",
          "EMPLOYEE"
        ),
        allowNull: false,
      },

      // ========================= MESSAGE =========================

      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      // ========================= MESSAGE TYPE =========================

      message_type: {
        type: Sequelize.ENUM(
          "TEXT",
          "TASK",
          "SYSTEM"
        ),
        allowNull: false,
        defaultValue: "TEXT",
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
      "task_messages",
      ["uuid"],
      {
        name: "idx_task_messages_uuid",
      }
    );

    await queryInterface.addIndex(
      "task_messages",
      ["task_id"],
      {
        name: "idx_task_messages_task_id",
      }
    );

    await queryInterface.addIndex(
      "task_messages",
      ["sender_id"],
      {
        name: "idx_task_messages_sender_id",
      }
    );

    await queryInterface.addIndex(
      "task_messages",
      ["sender_type"],
      {
        name: "idx_task_messages_sender_type",
      }
    );

    await queryInterface.addIndex(
      "task_messages",
      ["message_type"],
      {
        name: "idx_task_messages_message_type",
      }
    );

    await queryInterface.addIndex(
      "task_messages",
      ["task_id", "createdAt"],
      {
        name: "idx_task_messages_task_created",
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_messages');
  }
};