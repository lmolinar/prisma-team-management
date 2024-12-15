import { FC, useState } from "react";
import Select, { SingleValue } from "react-select";
import { DTORole } from "types/teams";

import { OtherUser } from "~/db/loaders/teams.$teamId";

type OptionType = {
    value: number;
    label: string;
};

type Props = {
    allMembers: Array<OtherUser>;
    roles: Array<DTORole>;
    onAdd: (member: OtherUser, role: DTORole) => void;
};

export const TeamMemberSelector: FC<Props> = ({ allMembers, roles, onAdd }) => {
    const rolesOptions = roles.map((r) => ({ label: r.name, value: r.id }));
    const membersOptions = allMembers.map((m) => ({ label: m.name, value: m.id }));
    const [member, setMember] = useState<OtherUser>();
    const [role, setRole] = useState<DTORole>();
    const isDisabled = !member || !role;

    const handleRoleChange = (newRole: SingleValue<OptionType>) => {
        if (!newRole) return;

        setRole({ id: newRole.value, name: newRole.label });
    };
    const handleMemberChange = (value: SingleValue<OptionType>) => {
        const newMember = allMembers.find((m) => m.id === value?.value);
        if (!newMember) return;

        setMember(newMember);
    };
    const handleAddClick = () => {
        if (!member || !role) return;

        onAdd(member, role);
        setMember(undefined);
        setRole(undefined);
    };

    return (
        <div className="membership-selector">
            <Select
                options={membersOptions}
                value={membersOptions.find((r) => r.value === member?.id) || null}
                onChange={handleMemberChange}
                placeholder="Select member"
            />
            <span> as </span>
            <Select
                options={rolesOptions}
                value={rolesOptions.find((t) => t.value === role?.id) || null}
                onChange={handleRoleChange}
                placeholder="Select role"
            />
            <button type="button" disabled={isDisabled} onClick={handleAddClick}>
                Add
            </button>
        </div>
    );
};
