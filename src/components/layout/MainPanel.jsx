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

                <div className="text-center">

                    <h2 className="text-2xl font-semibold text-white">

                        Password Manager

                    </h2>

                    <p className="mt-3 text-zinc-500">

                        Selecciona una carpeta para comenzar.

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