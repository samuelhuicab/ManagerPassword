import { useState } from "react";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

import useVault from "../../hooks/useVault";

import { ITEM_TYPES, getTypeLabel } from "../../constants/itemTypes";

export default function CreateItemModal() {

    const {

        createItemModal,
        closeCreateItemModal,
        createItemAction,

    } = useVault();

    const [title, setTitle] = useState("");

    const [itemType, setItemType] = useState("Website");

    const [saving, setSaving] = useState(false);

    if (!createItemModal.open) {

        return null;

    }

    async function handleCreate() {

        if (!title.trim()) return;

        setSaving(true);

        try {

            await createItemAction(

                createItemModal.nodeId,
                title.trim(),
                itemType,

            );

            setTitle("");

            setItemType("Website");

        } finally {

            setSaving(false);

        }

    }

    function handleClose() {

        setTitle("");

        setItemType("Website");

        closeCreateItemModal();

    }

    return (

        <Modal title="Nuevo elemento" onClose={handleClose}>

            <Input

                label="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: AWS Producción"
                autoFocus

            />

            <div className="mb-6">

                <label className="block text-sm text-zinc-400 mb-2">

                    Tipo

                </label>

                <select

                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}

                    className="
                        w-full
                        h-11
                        bg-zinc-900
                        border
                        border-zinc-800
                        rounded-lg
                        px-4
                        text-sm
                        text-white
                        outline-none
                        transition-colors
                        focus:border-blue-500
                    "

                >

                    {

                        ITEM_TYPES.map(t => (

                            <option key={t} value={t}>

                                {getTypeLabel(t)}

                            </option>

                        ))

                    }

                </select>

            </div>

            <div className="flex justify-end gap-3">

                <Button variant="secondary" onClick={handleClose}>

                    Cancelar

                </Button>

                <Button

                    variant="primary"
                    onClick={handleCreate}
                    disabled={saving || !title.trim()}

                >

                    {saving ? "Creando..." : "Crear"}

                </Button>

            </div>

        </Modal>

    );

}