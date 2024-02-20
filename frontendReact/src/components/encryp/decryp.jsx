import CryptoJs from "crypto-js"
import { secretKey } from "../../const/keys"

const dataDecript = (value) => {
    const bytes = CryptoJs.AES.decrypt(value, secretKey); 
    return  JSON.parse(bytes.toString(CryptoJs.enc.Utf8))
}