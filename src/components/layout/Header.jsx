import { useEffect, useState } from "react";

import { getCurrentWindow } from "@tauri-apps/api/window";

import { Search, ShieldCheck } from "lucide-react";

const appWindow = getCurrentWindow();

function MinimizeIcon() {

    return (

        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">

            <path d="M1 5H9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />

        </svg>

    );

}

function MaximizeIcon() {

    return (

        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">

            <rect x="1.5" y="1.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.1" />

        </svg>

    );

}

function RestoreIcon() {

    return (

        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">

            <rect x="2.5" y="1" width="6.5" height="6.5" rx="1" stroke="currentColor" strokeWidth="1.1" />

            <path d="M1 3.5V8.5C1 9.05 1.45 9.5 2 9.5H7" stroke="currentColor" strokeWidth="1.1" />

        </svg>

    );

}

function CloseIcon() {

    return (

        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">

            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />

        </svg>

    );

}

export default function Header() {

    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {

        let unlisten;

        async function init() {

            setIsMaximized(await appWindow.isMaximized());

            unlisten = await appWindow.onResized(async () => {

                setIsMaximized(await appWindow.isMaximized());

            });

        }

        init();

        return () => {

            if (unlisten) unlisten();

        };

    }, []);

    return (

        <header

            data-tauri-drag-region

            className="

                h-12

                bg-zinc-950

                border-b

                border-zinc-800

                flex

                items-center

                select-none

                shrink-0

            "

        >

            <div

                data-tauri-drag-region

                className="

                    flex

                    items-center

                    gap-2.5

                    pl-4

                    pr-3

                    h-full

                "

            >

                <div

                    className="

                        w-6.5

                        h-6.5

                        rounded-md

                        bg-zinc-900

                        border

                        border-zinc-800

                        flex

                        items-center

                        justify-center

                        text-blue-500

                        shrink-0

                    "

                >

                    <ShieldCheck size={13} />

                </div>

                <h1

                    className="

                        text-[13px]

                        font-semibold

                        text-zinc-300

                        tracking-tight

                        whitespace-nowrap

                    "

                >

                    Manager SSH

                </h1>

            </div>

            <div

                data-tauri-drag-region

                className="flex-1 h-full flex items-center justify-center px-4"

            >

                <div className="relative w-full max-w-sm">

                    <Search

                        size={15}

                        className="

                            absolute

                            left-3

                            top-1/2

                            -translate-y-1/2

                            text-zinc-500

                            pointer-events-none

                        "

                    />

                    <input

                        className="

                            w-full

                            h-8

                            bg-zinc-900

                            border

                            border-zinc-800

                            rounded-lg

                            pl-9

                            pr-4

                            text-sm

                            text-white

                            outline-none

                            transition-colors

                            placeholder:text-zinc-600

                            focus:border-blue-500

                        "

                        placeholder="Buscar..."

                    />

                </div>

            </div>

            <div className="flex items-center gap-0.5 pr-1.5 h-full shrink-0">

                <button

                    onClick={() => appWindow.minimize()}

                    title="Minimizar"

                    className="

                        w-8

                        h-8

                        rounded-md

                        flex

                        items-center

                        justify-center

                        text-zinc-500

                        hover:bg-zinc-800

                        hover:text-zinc-200

                        transition-colors

                    "

                >

                    <MinimizeIcon />

                </button>

                <button

                    onClick={() => appWindow.toggleMaximize()}

                    title={isMaximized ? "Restaurar" : "Maximizar"}

                    className="

                        w-8

                        h-8

                        rounded-md

                        flex

                        items-center

                        justify-center

                        text-zinc-500

                        hover:bg-zinc-800

                        hover:text-zinc-200

                        transition-colors

                    "

                >

                    {isMaximized ? <RestoreIcon /> : <MaximizeIcon />}

                </button>

                <button

                    onClick={() => appWindow.close()}

                    title="Cerrar"

                    className="

                        w-8

                        h-8

                        rounded-md

                        flex

                        items-center

                        justify-center

                        text-zinc-500

                        hover:bg-red-600

                        hover:text-white

                        transition-colors

                    "

                >

                    <CloseIcon />

                </button>

            </div>

        </header>

    );

}