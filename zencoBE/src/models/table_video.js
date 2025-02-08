const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('table_video', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    noibat: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    thumb: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    video: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ten_vi: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tenkhongdau: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    links: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    keywords: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(1024),
      allowNull: false
    },
    ten_en: {
      type: DataTypes.STRING(255),
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
      allowNull: false
    },
    ngaysua: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    luotxem: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'table_video',
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
