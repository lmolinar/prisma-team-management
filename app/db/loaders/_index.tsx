import { json } from "@remix-run/node";
import { DBTeamMetadata } from "types/teams";

import { pool } from "../../db/db.server";
import { query } from "../sql/teamsTree";

export type FlatTree = Array<{
    team_id: number;
    team_name: string;
    parent_team_id: number | null;
    metadata: DBTeamMetadata;
    level: number;
    member_id: number;
    member_name: string;
    member_avatar_url: string;
    active: boolean;
    role_name: string;
}>;

export type TreeMember = {
    id: number;
    active: boolean;
    avatarUrl: string;
    name: string;
    roleName: string;
};

export type TreeItem = {
    id: number;
    name: string;
    metadata: DBTeamMetadata;
    parentTeamId: null | number;
    members: TreeMember[];
    children: TreeItem[];
};

export function buildTeamsTree(flatData: FlatTree): TreeItem[] {
    // Create a map of teams by ID
    const teamsById: Record<string, TreeItem> = {};
    flatData.forEach((row) => {
        if (!teamsById[row.team_id]) {
            teamsById[row.team_id] = {
                id: row.team_id,
                name: row.team_name,
                metadata: row.metadata,
                parentTeamId: row.parent_team_id,

                members: [],
                children: [],
            };
        }

        // Add members to the team
        if (row.member_name) {
            teamsById[row.team_id].members.push({
                name: row.member_name,
                roleName: row.role_name,
                active: row.active,
                id: row.member_id,
                avatarUrl: row.member_avatar_url,
            });
        }
    });

    // Build the hierarchy
    const hierarchy: TreeItem[] = [];

    Object.values(teamsById).forEach((team) => {
        if (team.parentTeamId) {
            teamsById[team.parentTeamId].children.push(team);
        } else {
            hierarchy.push(team);
        }
    });

    return hierarchy;
}

export function buildLoader() {
    return async function () {
        const client = await pool.connect();
        const result = await client.query(query);

        client.release();

        return json(buildTeamsTree(result.rows));
    };
}
