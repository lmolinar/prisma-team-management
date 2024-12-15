import { json, LoaderFunctionArgs } from "@remix-run/node";
import { QueryResult } from "pg";
import invariant from "tiny-invariant";
import { DBRole, DBTeam, DBTeamMember, DTORole, DTOTeam, DTOTeamMember } from "types/teams";

import { pool } from "~/db/db.server";
import { getSqlAsString } from "~/db/sql/helpers";

type Node = {
    id: number;
    name: string;
    parent_team_id: number | null;
};

type MemberTeamRole = {
    team_id: DBTeam["id"];
    member_id: DBTeamMember["id"];
    member_name: DBTeamMember["name"];
    member_avatar_url: DBTeamMember["avatar_url"];
    active: DBTeamMember["active"];
    role_id: DBRole["id"];
    role_name: DBRole["name"];
};

type DTOMemberTeamRole = {
    teamId: DBTeam["id"];
    id: DBTeamMember["id"];
    name: DBTeamMember["name"];
    avatarUrl: DBTeamMember["avatar_url"];
    active: DBTeamMember["active"];
    roleId: DBRole["id"];
    roleName: DBRole["name"];
};

export type OtherUser = Pick<DTOTeamMember, "active" | "avatarUrl" | "id" | "name">;

export type TeamPayload = {
    team: Pick<DTOTeam, "id" | "name" | "parentTeamId" | "metadata">;
    possibleParentNodes: Pick<DTOTeam, "id" | "name">[];
    teamUsers: DTOMemberTeamRole[];
    otherUsers: OtherUser[];
    roles: DTORole[];
};

export function buildTeamPayload(queryResults: QueryResult[], teamId: number): TeamPayload {
    const [teamsDataResults, membersResults, rolesResults] = queryResults;
    const allTeams: DBTeam[] = teamsDataResults.rows;
    const allUsers: MemberTeamRole[] = membersResults.rows;
    const teamUsers = allUsers
        .filter((u) => u.team_id === teamId)
        .map((u) => ({
            roleId: u.role_id,
            roleName: u.role_name,
            active: u.active,
            name: u.member_name,
            id: u.member_id,
            teamId: u.team_id,
            avatarUrl: u.member_avatar_url,
        }));
    const teamUsersIds = teamUsers.map((u) => u.id);

    const otherUsersIds = new Set();
    typeof teamUsers;
    const otherUsers: OtherUser[] = [];
    allUsers.forEach((u) => {
        if (!teamUsersIds.includes(u.member_id) && !otherUsersIds.has(u.member_id)) {
            otherUsersIds.add(u.member_id);
            otherUsers.push({
                active: u.active,
                name: u.member_name,
                id: u.member_id,
                avatarUrl: u.member_avatar_url,
            });
        }
    });

    const team = allTeams.find((t) => t.id === teamId);
    invariant(team, "Team is undefined");

    function findDescendants(nodes: Node[], id: number): number[] {
        const descendants: number[] = [];

        function collectDescendants(id: number): void {
            nodes.forEach((node) => {
                if (node.parent_team_id === id) {
                    descendants.push(node.id);
                    collectDescendants(node.id); // Recursively collect descendants
                }
            });
        }

        collectDescendants(id);
        return descendants;
    }

    const descendantsIds = findDescendants(allTeams, teamId);

    return {
        team: {
            id: team.id,
            name: team.name,
            parentTeamId: team.parent_team_id,
            metadata: team.metadata,
        },
        possibleParentNodes: allTeams
            .filter((t) => t.id !== teamId && !descendantsIds.includes(t.id))
            .map((t) => ({
                id: t.id,
                name: t.name,
            })),
        teamUsers,
        otherUsers,
        roles: rolesResults.rows,
    };
}

export function buildLoader() {
    const teamQuery = getSqlAsString("/teamDetails.sql");

    return async function ({ params }: LoaderFunctionArgs) {
        invariant(params.teamId, "Expected params.teamId");

        const teamId = Number(params.teamId);

        const client = await pool.connect();
        const queryResults = await Promise.all([
            client.query(`SELECT id, name, parent_team_id, metadata FROM teams;`),
            client.query(teamQuery),
            client.query("SELECT id, name FROM roles ORDER BY name;"),
        ]);

        client.release();

        return json(buildTeamPayload(queryResults, teamId));
    };
}
