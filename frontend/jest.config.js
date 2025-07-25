/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "jest-preset-angular",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "jsdom",
  testTimeout: 20000, // slower machines need longer, than default 5 seconds to create test db.
  moduleNameMapper: {
    "^@entities/(.*)$": "<rootDir>/entities/$1",
    "^@app/(.*)$": "<rootDir>/app/$1",
    "^@resources/(.*)$": "<rootDir>/resources/$1",
    "^@constants/(.*)$": "<rootDir>/constants/$1",
    "^@dbConnection/(.*)$": "<rootDir>/db-connection/$1",
    "^@daos/(.*)$": "<rootDir>/daos/$1",
    "^@interfaces/(.*)$": "<rootDir>/interfaces/$1",
    "^@objTypes/(.*)$": "<rootDir>/types/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@tests/(.*)$": "<rootDir>/test/$1",
    "^@common/(.*)$": "<rootDir>/../../common/$1",
  },
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["./setup-jest.ts"],
};
