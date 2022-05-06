'use strict';
const { Model, DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Course);
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'First Name value is required'
          },
          notEmpty: {
            msg: 'First Name value is required'
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Last Name value is required'
          },
          notEmpty: {
            msg: 'Last Name value is required'
          }
        }
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Username already exists'
        },
        validate: {
          notNull: {
            msg: 'Username value is required'
          },
          notEmpty: {
            msg: 'Username value is required'
          }
        }
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email Address must be unique'
        },
        validate: {
          isEmail: {
            msg: 'Email Address format is invalid'
          },
          notNull: {
            msg: 'Email Address value is required'
          },
          notEmpty: {
            msg: 'Email Address value is required'
          }
        }
      },
      password: {
        // https://sequelize.org/api/v6/class/src/data-types.js~virtual
        type: DataTypes.VIRTUAL,
        allowNull: false,
        validate: {
          len: {
            args: [7,50],
            msg: 'Password should be between 7 and 50 characters in length'
          },
          // Commenting out additional password validations for now since it's not a project requirement
          // is: {
          //   args: /^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[\]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[\]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[\]{},.<>+=-]{7,50}$/,
          //   msg: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number. Special characters $%!@-+= okay.'
          // },
          notNull: {
            msg: 'Password value is required'
          },
          notEmpty: {
            msg: 'Password value is required'
          }
        }
      },
      confirmedPassword: {
        type: DataTypes.STRING,
        allowNull: false,
        // When a new user is created using the /api/users POST route the user's confirmedPassword
        // should be hashed before persisting the user to the database.
        set(val) {
          if (val === this.password) {
            this.setDataValue('confirmedPassword', bcryptjs.hashSync(val, 10));
          }
        },
        validate: {
          notNull: {
            msg: 'Both passwords must match'
          },
          // notEmpty might not actually be needed, but including just in case
          notEmpty: {
            msg: 'Password confirmation value is required'
          }
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
    sequelize }
  );
  return User;
};
