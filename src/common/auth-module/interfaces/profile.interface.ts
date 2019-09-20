// This is the generic user profile, which both the SAML and JWT styles should resolve to.
import {Roles} from "@auth/constants";

export interface Profile {
    email: string;
    givenName: string;
    sn: string;
    // not available for all accounts in prod
    // mailNickname: string;

    // DETPEPLocation - Primary Location
    extensionAttribute2: string;

    // casual employee locations
    detAttribute12: string;

    // groups?: string[];
    role?: Roles;
}