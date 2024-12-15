import { Form, MetaFunction, useLoaderData, useSubmit } from "@remix-run/react";
import { FormEventHandler, useMemo, useState } from "react";
import Select, { SingleValue } from "react-select";
import { toast } from "react-toastify";
import { DTORole } from "types/teams";

import { BackButton } from "~/components/backButton/BackButton";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { InlineUser } from "~/components/inlineUser/InlineUser";
import { TeamMemberSelector } from "~/components/TeamMemberSelector";
import { buildAction } from "~/db/actions/teams.$teamId";
import { buildLoader, OtherUser, TeamPayload } from "~/db/loaders/teams.$teamId";

type OptionType = {
    value: number;
    label: string;
};

export const meta: MetaFunction = () => [{ title: "Team Management - Prisma" }];
export const loader = buildLoader();
export const action = buildAction();
export { ErrorBoundary };

export default function Team() {
    const { otherUsers, possibleParentNodes, team, teamUsers, roles } = useLoaderData<TeamPayload>();
    const parentTeamsOptions = useMemo(
        () =>
            possibleParentNodes.map((t) => ({
                label: t.name,
                value: t.id,
            })),
        [possibleParentNodes]
    );
    const submit = useSubmit();
    const [name, setName] = useState(team.name);
    const [localParentTeamId, setLocalParentTeamId] = useState(team.parentTeamId);
    const [localTeamMembers, setLocalTeamMembers] = useState(teamUsers);

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        submit(
            {
                name,
                teamId: team.id,
                ...(localParentTeamId ? { parentTeamId: localParentTeamId } : {}),
                teamMemberships: JSON.stringify(
                    localTeamMembers.map((tm) => ({
                        memberId: tm.id,
                        roleId: tm.roleId,
                    }))
                ),
            },
            { method: "post" }
        );
    };

    const handleParentTeamChange = (newParentTeamId: SingleValue<OptionType>) => {
        if (!newParentTeamId) return;

        setLocalParentTeamId(newParentTeamId?.value);
    };
    const handleAddTeamMember = (member: OtherUser, role: DTORole) => {
        const teamMember = localTeamMembers.find((m) => m.id === member.id);
        if (teamMember) {
            toast.error("The selected user is already member of this team");
            return;
        }
        setLocalTeamMembers((currentTeamMembers) => [
            ...currentTeamMembers,
            {
                active: true,
                id: member.id,
                name: member.name,
                roleId: role.id,
                roleName: role.name,
                teamId: team.id,
                avatarUrl: member.avatarUrl,
            },
        ]);
        // TODO remove from other users
    };
    const handleRemoveTeamMember = (memberId: number) => {
        setLocalTeamMembers((currentTeamMembers) => currentTeamMembers.filter((m) => m.id !== memberId));
    };

    return (
        <div>
            <BackButton />
            <h1>Team Management - {team.name}</h1>
            {team.metadata && <p className="team-metadata">Displaying metadata: {JSON.stringify(team.metadata)}</p>}

            <Form method="POST" onSubmit={onSubmit} className="form">
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        className="text-input"
                        onChange={(e) => setName(e.currentTarget.value)}
                        type="text"
                        value={name}
                    />
                </div>
                <div className="field">
                    <label htmlFor="parentTeam">Parent team</label>
                    <Select
                        name="parentTeam"
                        options={parentTeamsOptions}
                        value={parentTeamsOptions.find((t) => t.value === localParentTeamId) || null}
                        onChange={handleParentTeamChange}
                        placeholder="Select parent team"
                    />
                </div>
                <div>
                    <h2>Members</h2>
                    <div className="team-members">
                        {localTeamMembers.map((m) => (
                            <div key={m.id} className="team-member">
                                <InlineUser member={m} />
                                <button type="button" onClick={() => handleRemoveTeamMember(m.id)}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2>Add Member</h2>
                    <TeamMemberSelector allMembers={otherUsers} onAdd={handleAddTeamMember} roles={roles} />
                </div>
                <button type="submit">Save</button>
            </Form>
        </div>
    );
}
