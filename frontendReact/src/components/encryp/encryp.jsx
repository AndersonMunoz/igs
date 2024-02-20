import CryptoJs from "crypto-js"
import { secretKey } from "../../const/keys"

export const dataEncript = (value) => {
    return CryptoJs.AES.encrypt(JSON.stringify(value), secretKey).toString()
}