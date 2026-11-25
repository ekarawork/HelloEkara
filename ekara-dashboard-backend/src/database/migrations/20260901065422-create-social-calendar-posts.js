'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('social_calendar_posts', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },

      client_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "clients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      post_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      platform: {
        type: Sequelize.ENUM(
          "instagram",
          "facebook",
          "linkedin",
          "youtube"
        ),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "draft",
          "approved",
          "scheduled",
          "published"
        ),
        allowNull: false,
        defaultValue: "draft",
      },

      content_type: {
        type: Sequelize.ENUM(
          "post",
          "reel",
          "carousel",
          "story"
        ),
        allowNull: false,
      },

      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      updated_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

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

    // =========================
    // Indexes
    // =========================

    await queryInterface.addIndex(
      "social_calendar_posts",
      ["uuid"],
      {
        name: "idx_social_calendar_posts_uuid",
      }
    );

    await queryInterface.addIndex(
      "social_calendar_posts",
      ["client_id"],
      {
        name: "idx_social_calendar_posts_client_id",
      }
    );

    await queryInterface.addIndex(
      "social_calendar_posts",
      ["post_date"],
      {
        name: "idx_social_calendar_posts_post_date",
      }
    );

    await queryInterface.addIndex(
      "social_calendar_posts",
      ["platform"],
      {
        name: "idx_social_calendar_posts_platform",
      }
    );

    await queryInterface.addIndex(
      "social_calendar_posts",
      ["status"],
      {
        name: "idx_social_calendar_posts_status",
      }
    );

    await queryInterface.addIndex(
      "social_calendar_posts",
      ["content_type"],
      {
        name: "idx_social_calendar_posts_content_type",
      }
    );

    await queryInterface.addIndex(
      "social_calendar_posts",
      ["created_by"],
      {
        name: "idx_social_calendar_posts_created_by",
      }
    );
    await queryInterface.addIndex(
      "social_calendar_posts",
      ["updated_by"],
      {
        name: "idx_social_calendar_posts_updated_by",
      }
    );
    // Useful for calendar month + client filtering
    await queryInterface.addIndex(
      "social_calendar_posts",
      ["client_id", "post_date"],
      {
        name: "idx_social_calendar_posts_client_date",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('social_calendar_posts');
  }
};