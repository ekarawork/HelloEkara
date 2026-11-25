'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_sessions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_sessions.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  user_sessions.init({
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },

      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },

      refresh_token: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
      },

      device_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      browser: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      platform: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },

      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },

      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      remember_me: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      last_activity: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'user_sessions',
      tableName: 'user_sessions',
      timestamps: true,
      indexes: [
        {
          name: 'user_sessions_user_id_index',
          fields: ['user_id'],
        },

        {
          name: 'user_sessions_expires_at_index',
          fields: ['expires_at'],
        },
      ],
    }
  );
  return user_sessions;
};