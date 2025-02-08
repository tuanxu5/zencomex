const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('table_lang', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tenbien: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dichnghia1: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dichnghia2: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dichnghia3: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dichnghia4: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'table_lang',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
