import { Table, Column, Model, DataType, Default } from "sequelize-typescript";
import { generarUUID, getTimestampLocal } from "../utils";

@Table({
    tableName: "user"
})
class User extends Model {
    @Column({
        type: DataType.STRING(100),
    })
    name: string;

    @Column({
        type: DataType.STRING(100),
    })
    lastname: string;

    @Default(generarUUID() )
    @Column({
       type: DataType.STRING(100)
    })
    uuid: string;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    isLogin: boolean;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    isValidate: boolean;

    @Default(getTimestampLocal())
    @Column({
        type: DataType.TIME
    })
    timestampLogin: string;
}

export default User;