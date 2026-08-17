import { FolderOpen } from "lucide-react";

import useVault from "../../hooks/useVault";

import ItemList from "../item/ItemList";
import ItemEditor from "../item/ItemEditor";

export default function MainPanel() {

    const {
        selectedNode,
    } = useVault();

    if (!selectedNode) {

        return (

            <main className="flex-1 bg-zinc-950 flex items-center justify-center">

                <div className="text-center max-w-xs">

                    <div

                        className="

                            w-14

                            h-14

                            rounded-xl

                            bg-zinc-900

                            border

                            border-zinc-800

                            flex

                            items-center

                            justify-center

                            mx-auto

                            text-zinc-600

                        "

                    >

                        <FolderOpen size={24} />

                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-white">

                        Ninguna carpeta seleccionada

                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">

                        Elegí una carpeta en el panel izquierdo para ver sus elementos.

                    </p>

                </div>

            </main>

        );

    }

    return (

        <main className="flex flex-1 overflow-hidden bg-zinc-950">

            <ItemList />

            <ItemEditor />

        </main>

    );

}