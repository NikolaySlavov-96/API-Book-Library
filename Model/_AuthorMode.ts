export default (sequelize, { DataTypes, }) => {
    const Author = sequelize.define('author', {
        author_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(60),
            require: true,
        },
        image: {
            type: DataTypes.STRING(145),
        },
        genre: {
            type: DataTypes.STRING(45),
        },
        isVerify: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    return Author;
};
