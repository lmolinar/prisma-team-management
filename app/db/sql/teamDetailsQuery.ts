export const query = `SELECT 
    tms.team_id AS team_id,
	tm.id AS member_id,
    tm.name AS member_name,
    tm.avatar_url AS member_avatar_url,
    tm.active,
    r.id AS role_id,
    r.name AS role_name
FROM team_memberships AS tms
LEFT JOIN team_members tm ON tms.member_id = tm.id
LEFT JOIN roles r ON tms.role_id = r.id
ORDER BY tm.name;`;
