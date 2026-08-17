import { Plus, FolderTree } from "lucide-react";

import TreeView from "../tree/TreeView";

import useVault from "../../hooks/useVault";

export default function Sidebar() {

    const { openCreateNodeModal } = useVault();

    return (

        <aside

            className="

                w-72

                bg-zinc-950

                border-r

                border-zinc-800

                flex

                flex-col

            "

        >

            <div

                className="

                    h-12

                    border-b

                    border-zinc-800

                    flex

                    items-center

                    justify-between

                    px-4

                "

            >

                <div className="flex items-center gap-2 text-zinc-400">

                    <FolderTree size={15} />

                    <span

                        className="

                            text-xs

                            font-semibold

                            uppercase

                            tracking-wider

                        "

                    >

                        Carpetas

                    </span>

                </div>

                <button

                    onClick={() => openCreateNodeModal(null)}

                    title="Nueva carpeta"

                    className="

                        w-7

                        h-7

                        rounded-md

                        flex

                        items-center

                        justify-center

                        text-zinc-400

                        hover:text-white

                        hover:bg-zinc-800

                        transition

                    "

                >

                    <Plus size={16}/>

                </button>

            </div>

            <div

                className="

                    flex-1

                    overflow-auto

                    py-1

                "

            >

                <TreeView/>

            </div>

        </aside>

    );

}