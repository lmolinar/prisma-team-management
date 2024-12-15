import { Form, MetaFunction, useLoaderData, useSubmit } from "@remix-run/react";
import { FormEventHandler, useState } from "react";
import { toast } from "react-toastify";
import invariant from "tiny-invariant";
import { DTOUserTeamMembership } from "types/teams";

import { BackButton } from "~/components/backButton/BackButton";
import { Switch } from "~/components/switch/Switch";
import { TeamMembershipSelector } from "~/components/TeamMembershipSelector";
import { buildAction } from "~/db/actions/users.$userId";
import { buildLoader, UserPayload } from "~/db/loaders/users.$userId";

import { ErrorBoundary } from "./teams.$teamId";

export const meta: MetaFunction = () => [{ title: "User Management - Prisma" }];
export const loader = buildLoader();
export const action = buildAction();
export { ErrorBoundary };

export default function User() {
    const { memberships, roles, teamMember, teams } = useLoaderData<UserPayload>();
    const submit = useSubmit();
    const [name, setName] = useState(teamMember.name);
    const [email, setEmail] = useState(teamMember.email);
    const [active, setActive] = useState(teamMember.active);

    const [localMemberships, setLocalMemberships] = useState<DTOUserTeamMembership[]>(memberships);
    const [newMembership, setNewMembership] = useState<Partial<DTOUserTeamMembership>>();

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        submit(
            { name, email, memberId: teamMember.id, active, memberships: JSON.stringify(localMemberships) },
            { method: "post" }
        );
    };

    const handleAddNewMembership = () => {
        if (!newMembership) return;

        if (localMemberships.find((m) => m.teamId === newMembership.teamId)) {
            toast.error(`${teamMember.name} is already member of this team`);
            return;
        }
        invariant(newMembership.roleId, "New membership is missing selected role");
        invariant(newMembership.teamId, "New membership is missing selected team");

        setLocalMemberships([...localMemberships, newMembership as DTOUserTeamMembership]);
        setNewMembership(undefined);
    };

    const handleRemoveMembership = (roleId: number | undefined, teamId: number | undefined) => {
        setLocalMemberships((memb) => memb.filter((m) => m.roleId !== roleId || m.teamId !== teamId));
    };

    const handleChangeNewMembership = (newValue: Partial<DTOUserTeamMembership>) => {
        setNewMembership(newValue);
    };

    const handleChangeMembership = (
        roleId: number | undefined,
        teamId: number | undefined,
        newValue: Partial<DTOUserTeamMembership>
    ) => {
        setLocalMemberships((memb) =>
            memb.map((m) => {
                if (m.roleId === roleId && m.teamId === teamId) {
                    return newValue as DTOUserTeamMembership;
                }
                return m;
            })
        );
    };

    const handleActiveChange = (checked: boolean) => {
        setActive(checked);
    };
    return (
        <div>
            <BackButton />
            <h1>User Management</h1>
            {teamMember.avatarUrl ? (
                <img src={teamMember.avatarUrl} alt={teamMember.name} className="member-avatar" />
            ) : null}
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
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        className="text-input"
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        type="text"
                        value={email}
                    />
                </div>
                <div className="field" style={{ width: 50 }}>
                    <label htmlFor="active">Active</label>
                    <Switch onChange={handleActiveChange} checked={active} />
                </div>
                <div>
                    <h2>Roles</h2>
                    {localMemberships.map((m, idx) => (
                        <TeamMembershipSelector
                            key={idx}
                            roles={roles}
                            teams={teams}
                            onRemove={() => handleRemoveMembership(m.roleId, m.teamId)}
                            onChange={(newValue) => handleChangeMembership(m.roleId, m.teamId, newValue)}
                            value={m}
                        />
                    ))}
                </div>
                <div>
                    <h2>Add role</h2>
                    <TeamMembershipSelector
                        roles={roles}
                        teams={teams}
                        onAdd={handleAddNewMembership}
                        onChange={(newValue) => handleChangeNewMembership(newValue)}
                        value={newMembership}
                    />
                </div>
                <button type="submit">Save</button>
            </Form>
        </div>
    );
}
