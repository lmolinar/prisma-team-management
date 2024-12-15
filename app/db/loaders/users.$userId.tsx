import { json, LoaderFunctionArgs } from "@remix-run/node";
import { QueryResult } from "pg";
import invariant from "tiny-invariant";
import { DBTeamMember, DBTeamMembership, DTORole, DTOTeam, DTOTeamMember, DTOTeamMembership } from "types/teams";

import { pool } from "../../db/db.server";

export type UserPayload = {
    teamMember: DTOTeamMember;
    memberships: Pick<DTOTeamMembership, "roleId" | "teamId">[];
    roles: DTORole[];
    teams: Pick<DTOTeam, "id" | "name">[];
};

export function buildUserPayload(queryResults: QueryResult[]): UserPayload {
    const [userDataResults, membershipsResults, rolesResults, teamsResults] = queryResults;
    const userData: DBTeamMember = userDataResults.rows[0];
    const memberships: Pick<DBTeamMembership, "role_id" | "team_id">[] = membershipsResults.rows;

    return {
        teamMember: {
            active: userData.active,
            email: userData.email,
            id: userData.id,
            name: userData.name,
            avatarUrl: userData.avatar_url,
        },
        memberships: memberships.map((m) => ({
            roleId: m.role_id,
            teamId: m.team_id,
        })),
        roles: rolesResults.rows,
        teams: teamsResults.rows,
    };
}

export function buildLoader() {
    return async function ({ params }: LoaderFunctionArgs) {
        invariant(params.userId, "Expected params.userId");

        const userId = params.userId;

        const client = await pool.connect();

        let error;
        const queryResults = await Promise.all([
            client.query("SELECT id, name, email, active, avatar_url FROM team_members WHERE id = $1;", [userId]),
            client.query("SELECT role_id, team_id FROM team_memberships WHERE member_id = $1;", [userId]),
            client.query("SELECT id, name FROM roles;"),
            client.query("SELECT id, name FROM teams;"),
        ]).catch(() => {
            error = { error: { message: "Something went wrong", type: "SQL" } };
            return [];
        });

        client.release();

        if (error) {
            return json(error);
        }

        return json(buildUserPayload(queryResults));
    };
}
