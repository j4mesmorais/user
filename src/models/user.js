module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codEmpresa: {
      type: DataTypes.STRING
    },
    caixaEntrada: {
      type: DataTypes.JSON
    },
    isSuperUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING
    },
    resetPasswordExpires: {
      type: DataTypes.DATE
    }        
  });

  return User;
};
