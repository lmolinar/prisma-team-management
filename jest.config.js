/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    moduleDirectories: ["app", "node_modules"],
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
};
