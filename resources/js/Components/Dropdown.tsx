import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import React, { createContext, useContext, useState } from 'react';

interface DropdownContextType {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    toggleOpen: () => void;
}

interface ChildrenProps {
    children: React.ReactNode;
}

const DropDownContext = createContext<DropdownContextType | null>(null);

function useDropdown() {
    const ctx = useContext(DropDownContext);
    if (!ctx) throw new Error("Dropdown components must be used inside <Dropdown>");
    return ctx;
}

const Dropdown = ({ children }: ChildrenProps) => {
    const [open, setOpen] = useState(false);
    const toggleOpen = () => setOpen(prev => !prev);

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }: ChildrenProps) => {
    const { open, setOpen, toggleOpen } = useDropdown();

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>
            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

interface ContentProps extends ChildrenProps {
    align?: "left" | "right";
    width?: string;
    contentClasses?: string;
}

const Content = ({
    align = "right",
    width = "48",
    contentClasses = "py-1 bg-white",
    children,
}: ContentProps) => {
    const { open, setOpen } = useDropdown();

    let alignmentClasses = "origin-top";
    if (align === "left") alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
    else if (align === "right") alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";

    const widthClasses = width === "48" ? "w-48" : "";

    return (
        <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div
                className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                onClick={() => setOpen(false)}
            >
                <div className={`rounded-md ring-1 ring-black ring-opacity-5 ${contentClasses}`}>
                    {children}
                </div>
            </div>
        </Transition>
    );
};

interface DropdownLinkProps {
    className?: string;
    children: React.ReactNode;
    [key: string]: any;
}

const DropdownLink = ({ className = "", children, ...props }: DropdownLinkProps) => {
    return (
        <Link
            {...props}
            className={
                "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none " +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
