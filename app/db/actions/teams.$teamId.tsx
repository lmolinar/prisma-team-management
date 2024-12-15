import { ActionFunctionArgs, redirect } from "@remix-run/node";
import format from "pg-format";
import { DTOTeamMembership } from "types/teams";

import { pool } from "~/db/db.server";

export function buildAction() {
    return async function ({ request }: ActionFunctionArgs) {
        const formData = await request.formData();
        const name = String(formData.get("name"));
        const teamId = Number(formData.get("teamId"));
        const parentTeamIdParam = formData.get("parentTeamId");
        const parentTeamId = parentTeamIdParam ? Number(formData.get("parentTeamId")) : null;
        const teamMemberships = JSON.parse(String(formData.get("teamMemberships"))) as Pick<
            DTOTeamMembership,
            "memberId" | "roleId"
        >[];

        try {
            await pool.connect();

            await pool.query("BEGIN");
            await pool.query("UPDATE teams SET name = $1, parent_team_id = $2 WHERE id = $3;", [
                name,
                parentTeamId,
                teamId,
            ]);
            await pool.query("DELETE FROM team_memberships WHERE team_id = $1;", [teamId]);
            const values = teamMemberships.map((m) => [teamId, m.memberId, m.roleId]);
            await pool.query(format("INSERT INTO team_memberships (team_id, member_id, role_id) VALUES %L", values));
            await pool.query("END");
        } catch (e) {
            // Properly log the error
            console.error(e);
        }

        return redirect("/");
    };
}
