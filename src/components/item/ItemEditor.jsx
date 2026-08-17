import { useEffect, useState } from "react";

import { Save, Trash2, Terminal, FileText } from "lucide-react";

import useVault from "../../hooks/useVault";

import FieldEditor from "./FieldEditor";

import { getTypeIcon, getTypeLabel } from "../../constants/itemTypes";

import {
    updateItemTitle,
    updateItemNotes,
    updateItemField,
    deleteItem,
    openSsh,
} from "../../services/vault";

export default function ItemEditor() {

    const {

        selectedItem,
        setSelectedItem,
        selectedNode,
        loadItems,

    } = useVault();

    const [draft, setDraft] = useState(null);

    const [saving, setSaving] = useState(false);

    const [dirty, setDirty] = useState(false);

    const [connecting, setConnecting] = useState(false);

    // Sincroniza el borrador SOLO cuando cambia el item seleccionado
    // (no en cada render), para no pisar lo que el usuario está escribiendo.
    useEffect(() => {

        if (!selectedItem) {

            setDraft(null);

            setDirty(false);

            return;

        }

        setDraft({

            title: selectedItem.title,

            notes: selectedItem.notes,

            fields: selectedItem.fields.map(f => ({ ...f })),

        });

        setDirty(false);

    }, [selectedItem?.id]);

    if (!selectedItem || !draft) {

        return (

            <section className="flex-1 bg-zinc-950 flex items-center justify-center">

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

                        <FileText size={24} />

                    </div>

                    <h2 className="mt-4 text-lg font-semibold text-white">

                        Ningún elemento seleccionado

                    </h2>

                    <p className="mt-2 text-sm text-zinc-500">

                        Elegí un elemento de la lista para ver y editar su información.

                    </p>

                </div>

            </section>

        );

    }

    function getFieldValue(key) {

        return draft.fields.find(f => f.key === key)?.value || "";

    }

    function changeTitle(value) {

        setDraft({ ...draft, title: value });

        setDirty(true);

    }

    function changeNotes(value) {

        setDraft({ ...draft, notes: value });

        setDirty(true);

    }

    function changeField(fieldId, value) {

        setDraft({

            ...draft,

            fields: draft.fields.map(f =>

                f.id === fieldId ? { ...f, value } : f

            ),

        });

        setDirty(true);

    }

    async function handleSave() {

        setSaving(true);

        try {

            const titleChanged = draft.title !== selectedItem.title;

            const notesChanged = draft.notes !== selectedItem.notes;

            const changedFields = draft.fields.filter(df => {

                const original = selectedItem.fields.find(f => f.id === df.id);

                return original && original.value !== df.value;

            });

            if (titleChanged) {

                await updateItemTitle(selectedItem.id, draft.title);

            }

            if (notesChanged) {

                await updateItemNotes(selectedItem.id, draft.notes);

            }

            for (const field of changedFields) {

                await updateItemField(selectedItem.id, field.key, field.value);

            }

            const updatedItem = {

                ...selectedItem,

                title: draft.title,

                notes: draft.notes,

                fields: draft.fields,

            };

            setSelectedItem(updatedItem);

            setDirty(false);

            if (selectedNode) {

                await loadItems(selectedNode.id);

            }

        } finally {

            setSaving(false);

        }

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

    async function handleConnectSsh() {

        const host = getFieldValue("host");

        const username = getFieldValue("username");

        if (!host || !username) {

            alert("Completá 'Host' y 'Usuario' antes de conectar.");

            return;

        }

        if (dirty) {

            const proceed = confirm(

                "Tenés cambios sin guardar. Se va a conectar con los valores actuales en pantalla, pero no se guardarán. ¿Continuar?"

            );

            if (!proceed) return;

        }

        setConnecting(true);

        try {

            await openSsh(host, username);

        } catch (err) {

            alert(`No se pudo abrir la conexión SSH: ${err}`);

        } finally {

            setConnecting(false);

        }

    }

    const isServer = selectedItem.item_type === "Server";

    const TypeIcon = getTypeIcon(selectedItem.item_type);

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

                    border-b

                    border-zinc-800

                    px-8

                    py-5

                "

            >

                <div className="flex items-start justify-between gap-6">

                    <div className="flex items-start gap-3 min-w-0">

                        <div

                            className="

                                w-10

                                h-10

                                rounded-lg

                                bg-zinc-900

                                border

                                border-zinc-800

                                flex

                                items-center

                                justify-center

                                shrink-0

                                mt-0.5

                                text-zinc-400

                            "

                        >

                            <TypeIcon size={18} />

                        </div>

                        <div className="min-w-0">

                            <input

                                value={draft.title}

                                onChange={(e) => changeTitle(e.target.value)}

                                placeholder="Sin título"

                                className="

                                    block

                                    w-full

                                    bg-transparent

                                    text-xl

                                    font-semibold

                                    text-white

                                    outline-none

                                    placeholder:text-zinc-600

                                "

                            />

                            <div

                                className="

                                    flex

                                    items-center

                                    gap-2

                                    mt-1

                                    text-xs

                                    text-zinc-500

                                "

                            >

                                <span>

                                    {getTypeLabel(selectedItem.item_type)}

                                </span>

                                {

                                    dirty &&

                                    <>

                                        <span className="text-zinc-700">•</span>

                                        <span className="text-amber-500 flex items-center gap-1">

                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />

                                            Sin guardar

                                        </span>

                                    </>

                                }

                            </div>

                        </div>

                    </div>

                    <div className="flex items-center gap-2 shrink-0">

                        {

                            isServer &&

                            <button

                                onClick={handleConnectSsh}

                                disabled={connecting}

                                title="Conectar por SSH"

                                className="

                                    flex

                                    items-center

                                    gap-2

                                    text-sm

                                    font-medium

                                    h-10

                                    px-4

                                    rounded-lg

                                    transition

                                    disabled:opacity-40

                                    disabled:cursor-not-allowed

                                    bg-zinc-900

                                    border

                                    border-zinc-800

                                    hover:border-emerald-600

                                    hover:text-emerald-500

                                    text-zinc-300

                                "

                            >

                                <Terminal size={16} />

                                {connecting ? "Conectando..." : "SSH"}

                            </button>

                        }

                        <button

                            onClick={handleSave}

                            disabled={!dirty || saving}

                            title="Guardar cambios"

                            className="

                                flex

                                items-center

                                gap-2

                                text-sm

                                font-medium

                                h-10

                                px-4

                                rounded-lg

                                transition

                                disabled:opacity-40

                                disabled:cursor-not-allowed

                                bg-blue-600

                                hover:bg-blue-500

                                text-white

                            "

                        >

                            <Save size={16} />

                            {saving ? "Guardando..." : "Guardar"}

                        </button>

                        <div className="w-px h-6 bg-zinc-800 mx-1" />

                        <button

                            onClick={handleDelete}

                            title="Eliminar elemento"

                            className="

                                w-10

                                h-10

                                rounded-lg

                                flex

                                items-center

                                justify-center

                                text-zinc-500

                                hover:text-red-500

                                hover:bg-zinc-900

                                transition

                            "

                        >

                            <Trash2 size={16} />

                        </button>

                    </div>

                </div>

            </div>

            <div className="max-w-4xl px-8 py-8">

                {

                    draft.fields.map(field => (

                        <FieldEditor

                            key={field.id}

                            field={field}

                            onChange={(value) => changeField(field.id, value)}

                        />

                    ))

                }

                <div className="mt-8">

                    <label className="block text-sm text-zinc-400 mb-2">

                        Notas

                    </label>

                    <textarea

                        rows={8}

                        value={draft.notes}

                        onChange={(e) => changeNotes(e.target.value)}

                        className="

                            w-full

                            bg-zinc-900

                            border

                            border-zinc-800

                            rounded-lg

                            px-4

                            py-3

                            text-sm

                            text-white

                            resize-none

                            outline-none

                            transition-colors

                            focus:border-blue-500

                        "

                    />

                </div>

            </div>

        </section>

    );

}