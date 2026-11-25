'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
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
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },

      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      employee_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      department: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      designation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      joining_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      employment_type: {
        type: Sequelize.ENUM(
          "FULL_TIME",
          "PART_TIME",
          "INTERN",
          "FREELANCER"
        ),
        allowNull: false,
        defaultValue: "FULL_TIME",
      },

      role: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: "EMPLOYEE",
      },

      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      profile_image: {
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
        onDelete: "SET NULL",
      },

      updated_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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

    // ========================= INDEXES =========================

    await queryInterface.addIndex("employees", ["uuid"], {
        name: "idx_employees_uuid",
    });

    await queryInterface.addIndex("employees", ["user_id"], {
        name: "idx_employees_user_id",
    });

    await queryInterface.addIndex("employees", ["email"], {
        name: "idx_employees_email",
    });

    await queryInterface.addIndex("employees", ["employee_code"], {
        name: "idx_employees_employee_code",
    });

    await queryInterface.addIndex("employees", ["department"], {
        name: "idx_employees_department",
    });

    await queryInterface.addIndex("employees", ["designation"], {
        name: "idx_employees_designation",
    });

    await queryInterface.addIndex("employees", ["role"], {
        name: "idx_employees_role",
    });

    await queryInterface.addIndex("employees", ["status"], {
        name: "idx_employees_status",
    });

    await queryInterface.addIndex("employees", ["created_by"], {
        name: "idx_employees_created_by",
    });

    await queryInterface.addIndex("employees", ["deleted_at"], {
        name: "idx_employees_deleted_at",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};