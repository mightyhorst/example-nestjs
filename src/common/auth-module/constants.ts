export enum PrincipalGroups {
    Dev = 'CN=SCHOOL.PRINCIPAL,OU=Groups,OU=Portal,OU=Services,DC=devdetnsw,DC=win',
    Test = 'CN=SCHOOL.PRINCIPAL,OU=Groups,OU=Portal,OU=Services,DC=uatdetnsw,DC=win',
    Prod = 'CN=SCHOOL.PRINCIPAL,OU=Groups,OU=Portal,OU=Services,DC=DETNSW,DC=WIN',
}

export enum Roles {
    // Principals who are accessing the system
    Principal = 'principal',

    // Field services who are accessing the system
    FieldServices = 'field_services',

    // People supporting the system which could be any kind of operations group within or external to ITD.
    Support = 'support',
}
