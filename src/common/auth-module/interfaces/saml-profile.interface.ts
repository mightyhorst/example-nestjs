export interface SAMLProfile {
    issuer?: string;
    sessionIndex?: string;
    nameID?: string;
    nameIDFormat?: string;
    nameQualifier?: string;
    spNameQualifier?: string;
    mail?: string;  // InCommon Attribute urn:oid:0.9.2342.19200300.100.1.3
    email?: string;  // `mail` if not present in the assertion
    // getAssertionXml(): string;  // get the raw assertion XML
    // getAssertion(): any;  // get the assertion XML parsed as a JavaScript object
    ID?: string;
    [attributeName: string]: any;  // arbitrary `AttributeValue`s
}
