'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client_performance_daily', {
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

      // Client
      client_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      // Client assigned service
      client_service_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'client_services',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      // Performance date
      performance_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      // Daily ad spend
      daily_spend: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },

      // Impressions / Views
      impressions: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // Clicks
      clicks: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // Leads
      leads: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // Number of times record has been edited
      edit_count: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },

      // Admin who created the record
      created_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      // Admin who last updated the record
      updated_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },

      // Soft delete
      deleted_at: {
        type: Sequelize.DATE,
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

    // UUID
    await queryInterface.addIndex(
      'client_performance_daily',
      ['uuid'],
      {
        name: 'idx_client_performance_daily_uuid',
      }
    );

    // Client
    await queryInterface.addIndex(
      'client_performance_daily',
      ['client_id'],
      {
        name: 'idx_client_performance_daily_client_id',
      }
    );

    // Client + performance date
    await queryInterface.addIndex(
      'client_performance_daily',
      ['client_id', 'performance_date'],
      {
        name: 'idx_client_performance_daily_client_date',
      }
    );

    // Performance date
    await queryInterface.addIndex(
      'client_performance_daily',
      ['performance_date'],
      {
        name: 'idx_client_performance_daily_performance_date',
      }
    );

    // One performance record per service per date
    await queryInterface.addIndex(
      'client_performance_daily',
      ['client_service_id', 'performance_date'],
      {
        unique: true,
        name: 'idx_client_performance_daily_service_date_unique',
      }
    );

    // Created by
    await queryInterface.addIndex(
      'client_performance_daily',
      ['created_by'],
      {
        name: 'idx_client_performance_daily_created_by',
      }
    );

    // Updated by
    await queryInterface.addIndex(
      'client_performance_daily',
      ['updated_by'],
      {
        name: 'idx_client_performance_daily_updated_by',
      }
    );

    // Soft delete
    await queryInterface.addIndex(
      'client_performance_daily',
      ['deleted_at'],
      {
        name: 'idx_client_performance_daily_deleted_at',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('client_performance_daily');
  },
};