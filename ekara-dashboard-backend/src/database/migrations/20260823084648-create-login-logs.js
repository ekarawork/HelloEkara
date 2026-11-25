'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('login_logs', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
      },

      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
      },

      browser: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      platform: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM(
          'LOGIN SUCCESS',
          'LOGIN FAILED',
          'ACCOUNT LOCKED',
          'LOGOUT',
          'TOKEN REFRESH'
        ),
        allowNull: false,
      },

      message: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });

    await queryInterface.addIndex('login_logs', ['user_id'], {
      name: 'login_logs_user_id_index',
    });

    await queryInterface.addIndex('login_logs', ['status'], {
      name: 'login_logs_status_index',
    });

    await queryInterface.addIndex('login_logs', ['createdAt'], {
      name: 'login_logs_created_at_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('login_logs');
  }
};