import { useLoaderData } from "@remix-run/react";

import { TeamNode } from "~/components/teamNode/TeamNode";
import { buildLoader, TreeItem } from "~/db/loaders/_index";

export const loader = buildLoader();

export default function Teams() {
    const teamsTree = useLoaderData<TreeItem[]>();

    return (
        <div className="org-tree">
            Teams Chart
            {teamsTree.map((team) => (
                <TeamNode key={team.id} team={team} />
            ))}
        </div>
    );
}
