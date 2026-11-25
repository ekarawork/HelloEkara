'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class login_logs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      login_logs.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  login_logs.init({
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

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },

      browser: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      platform: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          'LOGIN SUCCESS',
          'LOGIN FAILED',
          'ACCOUNT LOCKED',
          'LOGOUT',
          'TOKEN REFRESH'
        ),
        allowNull: false,
      },

      message: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
      modelName: 'login_logs',
      tableName: 'login_logs',
      timestamps: true,
      indexes: [
        {
          name: 'login_logs_user_id_index',
          fields: ['user_id'],
        },

        {
          name: 'login_logs_status_index',
          fields: ['status'],
        },

        {
          name: 'login_logs_created_at_index',
          fields: ['createdAt'],
        },
      ],
    }
  );
  return login_logs;
};