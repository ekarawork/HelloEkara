'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Admin who created the client
      client.belongsTo(models.user, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // Admin who last updated the client
      client.belongsTo(models.user, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });

      // Client services
      client.hasMany(models.client_service, {
        foreignKey: "client_id",
        as: "clientServices",
        onDelete: "CASCADE",
      });

      client.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
      });

      // Daily performance records
      client.hasMany(models.client_performance_daily, {
        foreignKey: 'client_id',
        as: 'dailyPerformance',
        onDelete: 'CASCADE',
      });

      // Client has many payments
      client.hasMany(models.payment, {
          foreignKey: "client_id",
          as: "payments",
      });

      // Social calendar posts
      client.hasMany(models.social_calendar_post, {
        foreignKey: "client_id",
        as: "socialCalendarPosts",
        onDelete: "CASCADE",
      });
      client.hasMany(models.task, {
        foreignKey: "client_id",
        as: "tasks",
        onDelete: "RESTRICT",
      });
    }
  }
  client.init({
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

      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
      },

      name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      login_id: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      monthly_service_fee: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },

      profile_photo: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      website_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      instagram_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      facebook_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      linkedin_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      youtube_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      agreement_contract: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
      },

      created_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      updated_by: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },

      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "client",
      tableName: "clients",

      timestamps: true,

      paranoid: true,
      deletedAt: "deleted_at",

      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          name: "idx_clients_uuid",
          fields: ["uuid"],
        },

        {
          name: "idx_clients_email",
          fields: ["email"],
        },

        {
          name: "idx_clients_login_id",
          fields: ["login_id"],
        },

        {
          name: "idx_clients_status",
          fields: ["status"],
        },

        {
          name: "idx_clients_created_by",
          fields: ["created_by"],
        },

        {
          name: "idx_clients_deleted_at",
          fields: ["deleted_at"],
        },
      ],
    }
  );
  return client;
};