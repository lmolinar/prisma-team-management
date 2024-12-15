import { FC } from "react";
import Select, { SingleValue } from "react-select";
import { DTORole, DTOTeam, DTOUserTeamMembership } from "types/teams";

type OptionType = {
    value: number;
    label: string;
};

type Props = {
    value: Partial<DTOUserTeamMembership> | undefined;
    roles: DTORole[];
    teams: Pick<DTOTeam, "id" | "name">[];
    onAdd?: () => void;
    onChange: (membership: Partial<DTOUserTeamMembership>) => void;
    onRemove?: () => void;
};

export const TeamMembershipSelector: FC<Props> = ({ roles, teams, value, onAdd, onChange, onRemove }) => {
    const rolesOptions = roles.map((r) => ({ label: r.name, value: r.id }));
    const teamsOptions = teams.map((t) => ({ label: t.name, value: t.id }));
    const isDisabled = !value || !value.roleId || !value.teamId;

    const handleRoleChange = (newRole: SingleValue<OptionType>) => {
        if (!newRole) return;

        onChange({ ...value, roleId: newRole.value });
    };
    const handleTeamChange = (newTeam: SingleValue<OptionType>) => {
        if (!newTeam) return;

        onChange({ ...value, teamId: newTeam.value });
    };

    return (
        <div className="membership-selector">
            <Select
                options={rolesOptions}
                value={(value ? rolesOptions.find((r) => r.value === value.roleId) : null) || null}
                onChange={handleRoleChange}
                placeholder="Select role"
            />
            <span> in team: </span>
            <Select
                options={teamsOptions}
                value={(value ? teamsOptions.find((t) => t.value === value.teamId) : null) || null}
                onChange={handleTeamChange}
                placeholder="Select team"
            />
            {onRemove ? (
                <button type="button" onClick={onRemove}>
                    Remove
                </button>
            ) : null}
            {onAdd ? (
                <button type="button" disabled={isDisabled} onClick={onAdd}>
                    Add
                </button>
            ) : null}
        </div>
    );
};
