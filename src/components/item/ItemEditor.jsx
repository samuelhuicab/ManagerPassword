import { Save, Trash2 } from "lucide-react";

import useVault from "../../hooks/useVault";

import FieldEditor from "./FieldEditor";

import {
    updateItemTitle,
    updateItemNotes,
    deleteItem,
} from "../../services/vault";

export default function ItemEditor() {

    const {

        selectedItem,
        setSelectedItem,
        selectedNode,
        loadItems,

    } = useVault();

    if (!selectedItem) {

        return (

            <section className="flex-1 bg-zinc-950 flex items-center justify-center">

                <div className="text-center">

                    <h2 className="text-white text-xl">

                        Selecciona un elemento

                    </h2>

                    <p className="text-zinc-500 mt-2">

                        Aquí aparecerá toda la información.

                    </p>

                </div>

            </section>

        );

    }

    async function changeTitle(value) {

        setSelectedItem({

            ...selectedItem,

            title: value,

        });

        await updateItemTitle(

            selectedItem.id,

            value,

        );

    }

    async function changeNotes(value) {

        setSelectedItem({

            ...selectedItem,

            notes: value,

        });

        await updateItemNotes(

            selectedItem.id,

            value,

        );

    }

    async function handleDelete() {

        if (!confirm(`¿Eliminar "${selectedItem.title}" de forma permanente?`))
            return;

        await deleteItem(selectedItem.id);

        setSelectedItem(null);

        if (selectedNode) {

            await loadItems(selectedNode.id);

        }

    }

    return (

        <section

            className="

                flex-1

                overflow-auto

                bg-zinc-950

            "

        >

            <div

                className="

                    h-14

                    border-b

                    border-zinc-800

                    flex

                    items-center

                    justify-between

                    px-6

                "

            >

                <h2

                    className="

                        text-lg

                        font-semibold

                        text-white

                    "

                >

                    {selectedItem.item_type}

                </h2>

                <div className="flex items-center gap-4">

                    <div

                        className="

                            flex

                            items-center

                            gap-2

                            text-green-500

                            text-sm

                        "

                    >

                        <Save size={16} />

                        Auto Save

                    </div>

                    <button

                        onClick={handleDelete}

                        className="

                            flex

                            items-center

                            gap-2

                            text-sm

                            text-zinc-400

                            hover:text-red-500

                            px-3

                            py-2

                            rounded-lg

                            hover:bg-zinc-900

                            transition

                        "

                    >

                        <Trash2 size={16} />

                        Eliminar

                    </button>

                </div>

            </div>

            <div className="max-w-4xl p-8">

                <div className="mb-8">

                    <label className="block text-sm text-zinc-400 mb-2">

                        Título

                    </label>

                    <input

                        value={selectedItem.title}

                        onChange={(e) => changeTitle(e.target.value)}

                        className="

                            w-full

                            bg-zinc-900

                            border

                            border-zinc-800

                            rounded-lg

                            px-4

                            py-3

                            text-white

                            outline-none

                            focus:border-blue-500

                        "

                    />

                </div>

                {

                    selectedItem.fields.map(field => (

                        <FieldEditor

                            key={field.id}

                            field={field}

                        />

                    ))

                }

                <div className="mt-8">

                    <label className="block text-sm text-zinc-400 mb-2">

                        Notas

                    </label>

                    <textarea

                        rows={8}

                        value={selectedItem.notes}

                        onChange={(e)=>changeNotes(e.target.value)}

                        className="

                            w-full

                            bg-zinc-900

                            border

                            border-zinc-800

                            rounded-lg

                            px-4

                            py-3

                            text-white

                            resize-none

                            outline-none

                            focus:border-blue-500

                        "

                    />

                </div>

            </div>

        </section>

    );

}