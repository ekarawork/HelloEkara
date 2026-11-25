'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class client_service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Client
      client_service.belongsTo(models.client, {
        foreignKey: "client_id",
        as: "client",
      });
      // Daily performance records
      client_service.hasMany(models.client_performance_daily, {
        foreignKey: 'client_service_id',
        as: 'dailyPerformance',
        onDelete: 'CASCADE',
      });
    }
  }
  client_service.init({
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

      service_name: {
          type: DataTypes.ENUM(
              'META_ADS',
              'GOOGLE_ADS',
              'WEBSITE_SALES',
              'ORGANIC_SOCIAL'
          ),
          allowNull: false,
      },

      monthly_budget: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'client_service',
      tableName: 'client_services',

      timestamps: true,

      createdAt: 'createdAt',
      updatedAt: 'updatedAt',

      indexes: [
        {
          name: 'idx_client_services_uuid',
          fields: ['uuid'],
        },

        {
          name: 'idx_client_services_client_id',
          fields: ['client_id'],
        },

        {
          name: 'idx_client_services_client_service_unique',
          unique: true,
          fields: ['client_id', 'service_name'],
        },
      ],
    }
  );

  return client_service;
};