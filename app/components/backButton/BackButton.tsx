import "./BackButton.css";

import { Link } from "@remix-run/react";
import { FC } from "react";

export const BackButton: FC = () => {
    return (
        <Link to="/" className="back-button">
            <button>⬅️ Back</button>
        </Link>
    );
};
