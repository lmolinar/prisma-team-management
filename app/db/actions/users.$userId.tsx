import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { pool } from "~/db/db.server";

export function buildAction() {
    return async function ({ request }: ActionFunctionArgs) {
        const formData = await request.formData();
        const name = String(formData.get("name"));
        const email = String(formData.get("email"));
        const active = String(formData.get("active"));
        const memberId = Number(formData.get("memberId"));
        const memberships = JSON.parse(String(formData.get("memberships"))) as Membership[];

        await pool.connect();

        await pool.query("BEGIN");

        await pool.query(
            `UPDATE team_members SET name = '${name}', email = '${email}', active = ${active} WHERE id = ${memberId};`
        );
        await pool.query(`DELETE FROM team_memberships WHERE member_id = ${memberId};`);
        await pool.query(
            `INSERT INTO team_memberships (team_id, member_id, role_id) VALUES ${memberships.map(
                (m) => `(${m.teamId}, ${memberId}, ${m.roleId})`
            )}`
        );

        await pool.query("END");

        return redirect("/");
    };
}
