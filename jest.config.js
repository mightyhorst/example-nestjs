module.exports = {
    moduleNameMapper: {
        '@common/(.*)': '<rootDir>/common/$1',
        "@components/(.*)": "<rootDir>/components/$1",
        "@middleware/(.*)": "<rootDir>/common/middleware/$1",
        "@services/(.*)": "<rootDir>/common/services/$1",
        "@models/(.*)": "<rootDir>/common/models/$1",
        "@enums/(.*)": "<rootDir>/common/models/enums/$1",
        "@errors/(.*)": "<rootDir>/common/models/errors/$1",
        "@requests/(.*)": "<rootDir>/common/models/requests/$1",
        "@responses/(.*)": "<rootDir>/common/models/responses/$1",
        "@auth/(.*)": "<rootDir>/common/auth-module/$1",
        "@utils/(.*)": "<rootDir>/common/utils/$1",
    },
    "moduleFileExtensions": [
        "js",
        "json",
        "ts"
    ],
    "rootDir": "src",
    "testRegex": ".spec.ts$",
    "transform": {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
};
