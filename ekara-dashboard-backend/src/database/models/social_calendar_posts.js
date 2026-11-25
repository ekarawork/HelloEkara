"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class social_calendar_post extends Model {
    static associate(models) {
      // =========================
      // Post belongs to client
      // =========================

      social_calendar_post.belongsTo(models.client, {
        foreignKey: "client_id",
        as: "client",
      });

      // =========================
      // Admin who created the post
      // =========================

      social_calendar_post.belongsTo(models.user, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // =========================
      // Admin who last updated the post
      // =========================

      social_calendar_post.belongsTo(models.user, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
    }
  }

  social_calendar_post.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
      },

      client_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      post_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      platform: {
        type: DataTypes.ENUM(
          "instagram",
          "facebook",
          "linkedin",
          "youtube"
        ),
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "draft",
          "approved",
          "scheduled",
          "published"
        ),
        allowNull: false,
        defaultValue: "draft",
      },

      content_type: {
        type: DataTypes.ENUM(
          "post",
          "reel",
          "carousel",
          "story"
        ),
        allowNull: false,
      },

      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
    },
    {
      sequelize,

      modelName: "social_calendar_post",

      tableName: "social_calendar_posts",

      timestamps: true,

      createdAt: "createdAt",

      updatedAt: "updatedAt",

      indexes: [
        {
          name: "idx_social_calendar_posts_uuid",
          fields: ["uuid"],
        },

        {
          name: "idx_social_calendar_posts_client_id",
          fields: ["client_id"],
        },

        {
          name: "idx_social_calendar_posts_client_date",
          fields: ["client_id", "post_date"],
        },

        {
          name: "idx_social_calendar_posts_post_date",
          fields: ["post_date"],
        },

        {
          name: "idx_social_calendar_posts_platform",
          fields: ["platform"],
        },

        {
          name: "idx_social_calendar_posts_status",
          fields: ["status"],
        },

        {
          name: "idx_social_calendar_posts_content_type",
          fields: ["content_type"],
        },

        {
          name: "idx_social_calendar_posts_created_by",
          fields: ["created_by"],
        },

        {
          name: "idx_social_calendar_posts_updated_by",
          fields: ["updated_by"],
        },
      ],
    }
  );

  return social_calendar_post;
};