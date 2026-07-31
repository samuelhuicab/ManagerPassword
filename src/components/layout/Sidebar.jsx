import {

    Plus,

} from "lucide-react";

import TreeView from "../tree/TreeView";

import useVault from "../../hooks/useVault";

export default function Sidebar() {

    const { openCreateNodeModal } = useVault();

    return (

        <aside

            className="

                w-72

                bg-zinc-900

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

                    px-3

                "

            >

                <span

                    className="

                        text-sm

                        font-semibold

                        text-zinc-300

                    "

                >

                    Carpetas

                </span>

                <button

                    onClick={() => openCreateNodeModal(null)}

                    className="

                        w-8

                        h-8

                        rounded

                        hover:bg-zinc-800

                        flex

                        items-center

                        justify-center

                    "

                >

                    <Plus size={16}/>

                </button>

            </div>

            <div

                className="

                    flex-1

                    overflow-auto

                "

            >

                <TreeView/>

            </div>

        </aside>

    );

}