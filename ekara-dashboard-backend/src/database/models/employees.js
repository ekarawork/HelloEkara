'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Admin who created the employee
      employee.belongsTo(models.user, {
        foreignKey: "created_by",
        as: "createdBy",
      });

      // Admin who last updated the employee
      employee.belongsTo(models.user, {
        foreignKey: "updated_by",
        as: "updatedBy",
      });
      employee.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
      });
      employee.hasMany(models.task_assignment, {
        foreignKey: "employee_id",
        as: "taskAssignments",
        onDelete: "CASCADE",
        hooks: true,
      });
    }
  }
  employee.init({
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
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },

      employee_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      joining_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      employment_type: {
        type: DataTypes.ENUM(
          "FULL_TIME",
          "PART_TIME",
          "INTERN",
          "FREELANCER"
        ),
        allowNull: false,
        defaultValue: "FULL_TIME",
      },

      role: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "EMPLOYEE",
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      profile_image: {
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
      modelName: "employee",
      tableName: "employees",

      timestamps: true,

      paranoid: true,
      deletedAt: "deleted_at",

      createdAt: "createdAt",
      updatedAt: "updatedAt",

      indexes: [
        {
          name: "idx_employees_uuid",
          fields: ["uuid"],
        },
        {
            name: "idx_employees_user_id",
            fields: ["user_id"],
        },
        {
          name: "idx_employees_email",
          fields: ["email"],
        },

        {
          name: "idx_employees_employee_code",
          fields: ["employee_code"],
        },

        {
          name: "idx_employees_department",
          fields: ["department"],
        },

        {
          name: "idx_employees_designation",
          fields: ["designation"],
        },

        {
          name: "idx_employees_role",
          fields: ["role"],
        },

        {
          name: "idx_employees_status",
          fields: ["status"],
        },

        {
          name: "idx_employees_created_by",
          fields: ["created_by"],
        },

        {
          name: "idx_employees_deleted_at",
          fields: ["deleted_at"],
        },
      ],
    }
  );
  return employee;
};