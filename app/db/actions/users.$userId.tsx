import { ActionFunctionArgs, redirect } from "@remix-run/node";
import format from "pg-format";
import { DTOTeamMembership } from "types/teams";

import { pool } from "../../db/db.server";

export function buildAction() {
    return async function ({ request }: ActionFunctionArgs) {
        const formData = await request.formData();
        const name = String(formData.get("name"));
        const email = String(formData.get("email"));
        const active = String(formData.get("active"));
        const memberId = Number(formData.get("memberId"));
        const memberships = JSON.parse(String(formData.get("memberships"))) as Pick<
            DTOTeamMembership,
            "roleId" | "teamId"
        >[];

        try {
            await pool.connect();

            await pool.query("BEGIN");

            await pool.query("UPDATE team_members SET name = $1, email = $2, active = $3 WHERE id = $4;", [
                name,
                email,
                active,
                memberId,
            ]);
            await pool.query("DELETE FROM team_memberships WHERE member_id = $1;", [memberId]);
            const values = memberships.map((m) => [m.teamId, memberId, m.roleId]);
            await pool.query(format("INSERT INTO team_memberships (team_id, member_id, role_id) VALUES %L", values));

            await pool.query("END");
        } catch (e) {
            // Properly log the error
            console.error(e);
        }

        return redirect("/");
    };
}
