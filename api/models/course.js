'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  }
  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Title is required.'
          },
          notEmpty: {
            msg: 'Title is required.'
          }
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Description is required.'
          },
          notEmpty: {
            msg: 'Description is required.'
          }
        }
      },
      estimatedTime: {
        type: DataTypes.STRING
      },
      materialsNeeded: {
        type: DataTypes.STRING
      }
    },
    { sequelize }
  );
  return Course;
};
