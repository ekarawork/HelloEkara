'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('client_services', {
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
          model: 'clients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      service_name: {
        type: Sequelize.ENUM(
            'META_ADS',
            'GOOGLE_ADS',
            'WEBSITE_SALES',
            'ORGANIC_SOCIAL'
        ),
        allowNull: false,
    },

      monthly_budget: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex('client_services', ['uuid'], {
      name: 'idx_client_services_uuid',
    });

    await queryInterface.addIndex('client_services', ['client_id'], {
      name: 'idx_client_services_client_id',
    });

    await queryInterface.addIndex(
      'client_services',
      ['client_id', 'service_name'],
      {
        unique: true,
        name: 'idx_client_services_client_service_unique',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('client_services');
  }
};