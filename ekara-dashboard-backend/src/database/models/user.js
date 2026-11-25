'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        // User sessions
        user.hasMany(models.user_sessions, {
            foreignKey: 'user_id',
            as: 'sessions',
            onDelete: 'CASCADE',
        });

        // Login logs
        user.hasMany(models.login_logs, {
            foreignKey: 'user_id',
            as: 'loginLogs',
            onDelete: 'CASCADE',
        });

        // ========================= Clients =========================

        user.hasMany(models.client, {
            foreignKey: 'created_by',
            as: 'createdClients',
            onDelete: 'SET NULL',
        });

        user.hasMany(models.client, {
            foreignKey: 'updated_by',
            as: 'updatedClients',
            onDelete: 'SET NULL',
        });

        user.hasOne(models.client, {
            foreignKey: "user_id",
            as: "client",
        });

        // ========================= Employees =========================

        user.hasMany(models.employee, {
            foreignKey: 'created_by',
            as: 'createdEmployees',
            onDelete: 'SET NULL',
        });

        user.hasMany(models.employee, {
            foreignKey: 'updated_by',
            as: 'updatedEmployees',
            onDelete: 'SET NULL',
        });

        user.hasOne(models.employee, {
            foreignKey: "user_id",
            as: "employee",
        });

        // ========================= Payments =========================

        user.hasMany(models.payment, {
            foreignKey: "created_by",
            as: "createdPayments",
        });

        user.hasMany(models.payment, {
            foreignKey: "updated_by",
            as: "updatedPayments",
        });

        // ========================= Payment Reminders =========================

        user.hasMany(models.payment_reminder, {
            foreignKey: "created_by",
            as: "createdPaymentReminders",
        });

        user.hasMany(models.payment_reminder, {
            foreignKey: "updated_by",
            as: "updatedPaymentReminders",
        });

        // ========================= Notifications =========================

        user.hasMany(models.notification, {
            foreignKey: "user_id",
            as: "notifications",
            onDelete: "CASCADE",
        });
        // ========================= CREATED TASKS =========================

        user.hasMany(models.task, {
          foreignKey: "created_by",
          as: "createdTasks",
        });

        // ========================= UPDATED TASKS =========================

        user.hasMany(models.task, {
          foreignKey: "updated_by",
          as: "updatedTasks",
        });

        // ========================= TASK ASSIGNMENTS =========================

        user.hasMany(models.task_assignment, {
          foreignKey: "assigned_by",
          as: "assignedTasks",
        });

        // ========================= TASK MESSAGES =========================

        user.hasMany(models.task_message, {
          foreignKey: "sender_id",
          as: "taskMessages",
        });

        // ========================= TASK ATTACHMENTS =========================

        user.hasMany(models.task_attachment, {
          foreignKey: "uploaded_by",
          as: "taskAttachments",
        });
    }
  }
  user.init({
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

      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      role: {
        type: DataTypes.ENUM(
          'SUPER_ADMIN',
          'ADMIN',
          'EMPLOYEE',
          'CLIENT'
        ),
        allowNull: false,
        defaultValue: 'CLIENT',
      },

      status: {
        type: DataTypes.ENUM(
          'ACTIVE',
          'INACTIVE',
          'BLOCKED'
        ),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },

      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      failed_login_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      locked_until: {
        type: DataTypes.DATE,
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
      modelName: 'user',
      tableName: 'users',
      timestamps: true,
      indexes: [
        {
          name: 'users_role_index',
          fields: ['role'],
        },

        {
          name: 'users_status_index',
          fields: ['status'],
        },
      ],
    }
  );

  return user;
};