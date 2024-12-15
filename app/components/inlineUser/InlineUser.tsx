import "./InlineUser.css";

import { Link } from "@remix-run/react";
import cx from "classnames";
import { FC } from "react";

import { TreeMember } from "~/db/loaders/_index";

type Props = {
    member: TreeMember;
};

export const InlineUser: FC<Props> = ({ member }) => {
    const isActive = member.active;

    return (
        <div className="inline-user">
            <img src={member.avatarUrl} alt={member.name} className="user-avatar" />
            <span
                className={cx("user-name", {
                    active: isActive,
                })}
            >
                {member.name}
            </span>
            <span className="user-role">
                ({member.roleName}
                {member.active ? "" : " - Deactivated"})
            </span>
            <Link to={`/users/${member.id}`}>
                <button>Edit</button>
            </Link>
        </div>
    );
};
