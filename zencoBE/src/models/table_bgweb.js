const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('table_bgweb', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    re_peat: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    tren: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    trai: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    fix_bg: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    mauneen: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    stt: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1
    },
    hienthi: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1
    },
    ngaytao: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ngaysua: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'table_bgweb',
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
