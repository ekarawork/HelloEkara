'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clients', {
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

      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        unique: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      login_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      monthly_service_fee: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },

      profile_photo: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      website_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      instagram_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      facebook_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      linkedin_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      youtube_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      agreement_contract: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("ACTIVE", "INACTIVE"),
        allowNull: false,
        defaultValue: "ACTIVE",
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

      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
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

    // Indexes
    await queryInterface.addIndex("clients", ["uuid"], {
      name: "idx_clients_uuid",
    });

    await queryInterface.addIndex("clients", ["email"], {
      name: "idx_clients_email",
    });

    await queryInterface.addIndex("clients", ["login_id"], {
      name: "idx_clients_login_id",
    });

    await queryInterface.addIndex("clients", ["status"], {
      name: "idx_clients_status",
    });

    await queryInterface.addIndex("clients", ["created_by"], {
      name: "idx_clients_created_by",
    });

    await queryInterface.addIndex("clients", ["deleted_at"], {
      name: "idx_clients_deleted_at",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clients');
  }
};