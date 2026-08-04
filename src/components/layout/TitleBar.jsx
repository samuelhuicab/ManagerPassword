import { useEffect, useState } from "react";

import { getCurrentWindow } from "@tauri-apps/api/window";

import { Minus, Square, Copy, X, ShieldCheck } from "lucide-react";

const appWindow = getCurrentWindow();

export default function TitleBar() {

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

    function handleMinimize() {

        appWindow.minimize();

    }

    function handleToggleMaximize() {

        appWindow.toggleMaximize();

    }

    function handleClose() {

        appWindow.close();

    }

    return (

        <div

            data-tauri-drag-region

            className="

                h-8

                bg-zinc-950

                border-b

                border-zinc-800

                flex

                items-center

                justify-between

                select-none

                shrink-0

            "

        >

            <div

                data-tauri-drag-region

                className="

                    flex

                    items-center

                    gap-2

                    px-3

                    h-full

                    flex-1

                    min-w-0

                "

            >

                <ShieldCheck size={13} className="text-blue-500 shrink-0" />

                <span

                    className="

                        text-xs

                        text-zinc-400

                        truncate

                    "

                >

                    Manager SSH

                </span>

            </div>

            <div className="flex items-stretch h-full shrink-0">

                <button

                    onClick={handleMinimize}

                    title="Minimizar"

                    className="

                        w-11

                        h-full

                        flex

                        items-center

                        justify-center

                        text-zinc-400

                        hover:bg-zinc-800

                        hover:text-white

                        transition-colors

                    "

                >

                    <Minus size={14} />

                </button>

                <button

                    onClick={handleToggleMaximize}

                    title={isMaximized ? "Restaurar" : "Maximizar"}

                    className="

                        w-11

                        h-full

                        flex

                        items-center

                        justify-center

                        text-zinc-400

                        hover:bg-zinc-800

                        hover:text-white

                        transition-colors

                    "

                >

                    {

                        isMaximized

                        ?

                            <Copy size={12} />

                        :

                            <Square size={12} />

                    }

                </button>

                <button

                    onClick={handleClose}

                    title="Cerrar"

                    className="

                        w-11

                        h-full

                        flex

                        items-center

                        justify-center

                        text-zinc-400

                        hover:bg-red-600

                        hover:text-white

                        transition-colors

                    "

                >

                    <X size={15} />

                </button>

            </div>

        </div>

    );

}