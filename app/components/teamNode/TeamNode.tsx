import "./TeamNode.css";

import { Link } from "@remix-run/react";
import cx from "classnames";
import { FC, useState } from "react";

import { TreeItem } from "~/db/loaders/_index";

import { CollapseIcon } from "../collapseIcon/CollapseIcon";
import { InlineUser } from "../inlineUser/InlineUser";

type Props = {
    team: TreeItem;
};

export const TeamNode: FC<Props> = ({ team }) => {
    const [collapsed, setCollapsed] = useState(false);

    const handleTeamClick = () => {
        setCollapsed((prevValue) => !prevValue);
    };

    return (
        <div className="team-node">
            <div className="team-header">
                <h2>
                    <div className="team-name" onClick={handleTeamClick}>
                        {team.name} <CollapseIcon collapsed={collapsed} />
                    </div>
                    <Link to={`/teams/${team.id}`}>
                        <button type="button">Edit</button>
                    </Link>
                </h2>
            </div>
            <ul
                className={cx("members-list", {
                    collapsed,
                })}
            >
                {team.members.map((member) => (
                    <li key={member.id} className="member-list-item">
                        <InlineUser member={member} />
                    </li>
                ))}
            </ul>
            {team.children && team.children.length > 0 && (
                <div
                    className={cx("subteams", {
                        collapsed,
                    })}
                >
                    {team.children.map((child) => (
                        <TeamNode key={child.id} team={child} />
                    ))}
                </div>
            )}
        </div>
    );
};
