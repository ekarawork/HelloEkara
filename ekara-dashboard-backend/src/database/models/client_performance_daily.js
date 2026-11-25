'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class client_performance_daily extends Model {
    static associate(models) {
      // Performance belongs to client
      client_performance_daily.belongsTo(models.client, {
        foreignKey: 'client_id',
        as: 'client',
      });

      // Performance belongs to client service
      client_performance_daily.belongsTo(models.client_service, {
        foreignKey: 'client_service_id',
        as: 'clientService',
      });

      // Admin who created the record
      client_performance_daily.belongsTo(models.user, {
        foreignKey: 'created_by',
        as: 'createdBy',
      });

      // Admin who last updated the record
      client_performance_daily.belongsTo(models.user, {
        foreignKey: 'updated_by',
        as: 'updatedBy',
      });
    }
  }

  client_performance_daily.init(
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

      client_service_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      performance_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      daily_spend: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },

      impressions: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      clicks: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      leads: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      edit_count: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
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
      modelName: 'client_performance_daily',
      tableName: 'client_performance_daily',

      timestamps: true,

      // Soft delete
      paranoid: true,
      deletedAt: 'deleted_at',

      createdAt: 'createdAt',
      updatedAt: 'updatedAt',

      indexes: [
        {
          name: 'idx_client_performance_daily_uuid',
          fields: ['uuid'],
        },

        {
          name: 'idx_client_performance_daily_client_id',
          fields: ['client_id'],
        },

        {
          name: 'idx_client_performance_daily_client_date',
          fields: ['client_id', 'performance_date'],
        },

        {
          name: 'idx_client_performance_daily_performance_date',
          fields: ['performance_date'],
        },

        {
          name: 'idx_client_performance_daily_service_date_unique',
          unique: true,
          fields: ['client_service_id', 'performance_date'],
        },

        {
          name: 'idx_client_performance_daily_created_by',
          fields: ['created_by'],
        },

        {
          name: 'idx_client_performance_daily_updated_by',
          fields: ['updated_by'],
        },

        {
          name: 'idx_client_performance_daily_deleted_at',
          fields: ['deleted_at'],
        },
      ],
    }
  );

  return client_performance_daily;
};