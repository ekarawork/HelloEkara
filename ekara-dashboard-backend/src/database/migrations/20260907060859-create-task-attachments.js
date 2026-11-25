'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_attachments', {
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

      // ========================= MESSAGE =========================

      message_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "task_messages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // ========================= UPLOADED BY =========================

      uploaded_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      // ========================= FILE INFORMATION =========================

      file_url: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },

      file_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      file_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      file_size: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },

      resource_type: {
        type: Sequelize.STRING(50),
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

    await queryInterface.addIndex(
      "task_attachments",
      ["uuid"],
      {
        name: "idx_task_attachments_uuid",
      }
    );

    await queryInterface.addIndex(
      "task_attachments",
      ["task_id"],
      {
        name: "idx_task_attachments_task_id",
      }
    );

    await queryInterface.addIndex(
      "task_attachments",
      ["message_id"],
      {
        name: "idx_task_attachments_message_id",
      }
    );

    await queryInterface.addIndex(
      "task_attachments",
      ["uploaded_by"],
      {
        name: "idx_task_attachments_uploaded_by",
      }
    );

    await queryInterface.addIndex(
      "task_attachments",
      ["file_type"],
      {
        name: "idx_task_attachments_file_type",
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_attachments');
  }
};