import { ReactNode } from "react";

export function IconButton({
    icon,
    onClick,
    activated
}: {
    icon: ReactNode;
    onClick: () => void;
    activated: boolean;
}) {
    return (
        <div
            className={`rounded border p-2 bg-black hover:bg-gray-700 ${
                activated ? "text-red-500" : "text-white"
            } m-1 cursor-pointer transition-colors duration-200`}
            onClick={onClick}
        >
            {icon}
        </div>
    );
}
