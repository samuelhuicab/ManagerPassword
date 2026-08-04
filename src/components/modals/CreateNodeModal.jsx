import { useState } from "react";

import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

import useVault from "../../hooks/useVault";

const NODE_TYPES = ["Folder", "Category"];

const NODE_TYPE_LABEL = {
    Folder: "Carpeta",
    Category: "Categoría",
};

export default function CreateNodeModal() {

    const {

        createNodeModal,
        closeCreateNodeModal,
        createNodeAction,

    } = useVault();

    const [name, setName] = useState("");

    const [nodeType, setNodeType] = useState("Folder");

    const [saving, setSaving] = useState(false);

    if (!createNodeModal.open) {

        return null;

    }

    async function handleCreate() {

        if (!name.trim()) return;

        setSaving(true);

        try {

            await createNodeAction(

                name.trim(),
                createNodeModal.parentId,
                nodeType,

            );

            setName("");

            setNodeType("Folder");

        } finally {

            setSaving(false);

        }

    }

    function handleClose() {

        setName("");

        setNodeType("Folder");

        closeCreateNodeModal();

    }

    return (

        <Modal title="Nueva carpeta" onClose={handleClose}>

            <Input

                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Servidores producción"
                autoFocus

            />

            <div className="mb-6">

                <label className="block text-sm text-zinc-400 mb-2">

                    Tipo

                </label>

                <select

                    value={nodeType}
                    onChange={(e) => setNodeType(e.target.value)}

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

                        NODE_TYPES.map(t => (

                            <option key={t} value={t}>

                                {NODE_TYPE_LABEL[t]}

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
                    disabled={saving || !name.trim()}

                >

                    {saving ? "Creando..." : "Crear"}

                </Button>

            </div>

        </Modal>

    );

}