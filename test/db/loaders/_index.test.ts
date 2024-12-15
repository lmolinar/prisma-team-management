import { buildTeamsTree } from "../../../app/db/loaders/_index";
import { multiRootTree, singleRootTree } from "./mockData";

describe("loaders/_index", () => {
    describe("buildTeamsTree", () => {
        test("Should build empty tree", () => {
            expect(buildTeamsTree([])).toEqual([]);
        });

        test("Should build tree with 1 root team", () => {
            expect(buildTeamsTree(singleRootTree)).toEqual([
                {
                    children: [
                        {
                            children: [
                                {
                                    children: [],
                                    id: 3,
                                    members: [
                                        {
                                            active: true,
                                            avatarUrl: "http://example.com",
                                            id: 3,
                                            name: "User C",
                                            roleName: "Role ZZZ",
                                        },
                                    ],
                                    metadata: {
                                        department: "Dep-c",
                                    },
                                    name: "Ccc",
                                    parentTeamId: 2,
                                },
                            ],
                            id: 2,
                            members: [
                                {
                                    active: true,
                                    avatarUrl: "http://example.com",
                                    id: 2,
                                    name: "User B",
                                    roleName: "Role YYY",
                                },
                            ],
                            metadata: {
                                department: "Dep-b",
                            },
                            name: "Bbb",
                            parentTeamId: 1,
                        },
                    ],
                    id: 1,
                    members: [
                        {
                            active: true,
                            avatarUrl: "http://example.com",
                            id: 1,
                            name: "User A",
                            roleName: "Role XXX",
                        },
                    ],
                    metadata: {
                        department: "Dep-a",
                    },
                    name: "Aaa",
                    parentTeamId: null,
                },
            ]);
        });

        test("Should build tree with multiple roots", () => {
            expect(buildTeamsTree(multiRootTree)).toEqual([
                {
                    children: [],
                    id: 1,
                    members: [
                        {
                            active: true,
                            avatarUrl: "http://example.com",
                            id: 1,
                            name: "User A",
                            roleName: "Role XXX",
                        },
                    ],
                    metadata: {
                        department: "Dep-a",
                    },
                    name: "Aaa",
                    parentTeamId: null,
                },
                {
                    children: [],
                    id: 2,
                    members: [
                        {
                            active: true,
                            avatarUrl: "http://example.com",
                            id: 2,
                            name: "User B",
                            roleName: "Role YYY",
                        },
                    ],
                    metadata: {
                        department: "Dep-b",
                    },
                    name: "Bbb",
                    parentTeamId: null,
                },
                {
                    children: [],
                    id: 3,
                    members: [
                        {
                            active: true,
                            avatarUrl: "http://example.com",
                            id: 3,
                            name: "User C",
                            roleName: "Role ZZZ",
                        },
                    ],
                    metadata: {
                        department: "Dep-c",
                    },
                    name: "Ccc",
                    parentTeamId: null,
                },
            ]);
        });
    });
});
