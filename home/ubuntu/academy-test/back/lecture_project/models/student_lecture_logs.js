module.exports = (sequelize, DataTypes) => {
  const student_lecture_log = sequelize.define('student_lecture_log', {
    student_lecture_log_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    participation_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    understanding_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    concentration_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    total_time: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    total_type: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    m_total_time: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    m_total_type: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    latest_pic_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    face_auth: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  }, {
    underscored: true,
    timestamps: false,
    indexes: [{ unique: true, fields: ['user_id', 'lecture_id', 'order'] }],
  });

  student_lecture_log.associate = (models) => {
    models.student_lecture_log.belongsTo(models.lecture, { onDelete: 'cascade', foreignKey: 'lecture_id' });
    models.student_lecture_log.belongsTo(models.user, { onDelete: 'cascade', foreignKey: 'user_id' });
  };

  return student_lecture_log;
};
