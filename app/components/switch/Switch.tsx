import "./Switch.css";

import { FC } from "react";

type Props = {
    checked: boolean;
    onChange: (checked: boolean) => void;
};

export const Switch: FC<Props> = ({ checked, onChange }) => {
    return (
        <>
            <input
                type="checkbox"
                id="toggle"
                className="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.currentTarget.checked)}
            />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="toggle" className="switch"></label>
        </>
    );
};
