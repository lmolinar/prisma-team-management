export type DBTeamMember = {
    id: number;
    active: boolean;
    avatar_url: string;
    email: string;
    name: string;
};

export type DBTeamMetadata = {
    department?: string;
    focus?: string;
};

export type DBTeam = {
    id: number;
    name: string;
    parent_team_id: null | number;
    metadata: DBTeamMetadata;
};

export type DBRole = {
    id: number;
    name: string;
};

export type DBTeamMembership = {
    id: number;
    team_id: number;
    member_id: number;
    role_id: number;
};

export type DTOTeamMember = {
    id: number;
    active: boolean;
    avatarUrl: string;
    email: string;
    name: string;
};

export type DTOTeamMembership = {
    id: number;
    teamId: number;
    memberId: number;
    roleId: number;
};

export type DTOUserTeamMembership = Pick<DTOTeamMembership, "roleId" | "teamId">;

export type DTORole = {
    id: DBRole["id"];
    name: DBRole["name"];
};

export type DTOTeam = {
    id: DBTeam["id"];
    name: DBTeam["name"];
    parentTeamId: DBTeam["parent_team_id"];
    metadata: DBTeam["metadata"];
};
