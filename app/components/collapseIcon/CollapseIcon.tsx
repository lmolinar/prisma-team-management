import "./CollapseIcon.css";

import cx from "classnames";
import { FC } from "react";

type Props = {
    collapsed: boolean;
};

export const CollapseIcon: FC<Props> = ({ collapsed }) => {
    return (
        <span
            className={cx("collapse-icon", {
                collapsed,
            })}
        />
    );
};
