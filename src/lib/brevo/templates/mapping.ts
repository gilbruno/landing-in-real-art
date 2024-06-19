import { TESTNET_REGISTRATION_SUBJECT } from "../constants";
import { templateTestnetRegistration } from "./templates";


export const mappingEmailTemplates = {
    'TestnetRegistration': {
        subject: TESTNET_REGISTRATION_SUBJECT,
        tpl: templateTestnetRegistration
    }
}