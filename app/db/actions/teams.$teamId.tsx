import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { DTOTeamMembership } from "types/teams";

import { pool } from "~/db/db.server";

export function buildAction() {
    return async function ({ request }: ActionFunctionArgs) {
        const formData = await request.formData();
        const name = String(formData.get("name"));
        const teamId = String(formData.get("teamId"));
        const parentTeamId = String(formData.get("parentTeamId"));
        const teamMemberships = JSON.parse(String(formData.get("teamMemberships"))) as Pick<
            DTOTeamMembership,
            "memberId" | "roleId"
        >[];

        await pool.connect();

        await pool.query("BEGIN");
        await pool.query(`UPDATE teams SET name = '${name}', parent_team_id = '${parentTeamId}' WHERE id = ${teamId};`);
        await pool.query(`DELETE FROM team_memberships WHERE team_id = ${teamId};`);
        await pool.query(
            `INSERT INTO team_memberships (team_id, member_id, role_id) VALUES ${teamMemberships.map(
                (m) => `(${teamId}, ${m.memberId}, ${m.roleId})`
            )}`
        );
        await pool.query("END");

        return redirect("/");
    };
}
