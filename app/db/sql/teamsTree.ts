export const query = `WITH RECURSIVE team_hierarchy AS (
    SELECT 
        id AS team_id,
        name AS team_name,
        parent_team_id,
        metadata::json AS metadata,
        1 AS level
    FROM teams
    WHERE parent_team_id IS NULL

    UNION ALL

    SELECT 
        t.id AS team_id,
        t.name AS team_name,
        t.parent_team_id,
        t.metadata::json AS metadata,
        th.level + 1 AS level
    FROM teams t
    INNER JOIN team_hierarchy th ON t.parent_team_id = th.team_id
)
SELECT 
    th.team_id,
    th.team_name,
    th.parent_team_id,
    th.metadata,
    th.level,
	tm.id AS member_id,
    tm.name AS member_name,
    tm.avatar_url AS member_avatar_url,
    tm.active,
    r.name AS role_name
FROM team_hierarchy th
LEFT JOIN team_memberships tms ON th.team_id = tms.team_id
LEFT JOIN team_members tm ON tms.member_id = tm.id
LEFT JOIN roles r ON tms.role_id = r.id
ORDER BY th.level, th.team_id;`;
