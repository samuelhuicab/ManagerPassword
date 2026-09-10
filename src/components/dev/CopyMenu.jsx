import { useEffect, useRef, useState } from "react";
import { ClipboardCopy, ChevronDown, Check } from "lucide-react";

import { copyConnectionString } from "../../services/dev";
import { getSettings } from "../../services/auth";

/**
 * Menú de formatos de copiado para un item.
 * `item` es el VaultItem seleccionado (con sus fields).
 */
export default function CopyMenu({ item }) {

    const [open, setOpen] = useState(false);
    const [done, setDone] = useState("");
    const [clearAfter, setClearAfter] = useState(20);
    const ref = useRef(null);

    useEffect(() => {
        getSettings()
            .then((s) => setClearAfter(s.clipboardClearSeconds ?? 20))
            .catch(() => {});
    }, []);

    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        window.addEventListener("mousedown", onClick);
        return () => window.removeEventListener("mousedown", onClick);
    }, []);

    const canConn =
        item.item_type === "Database" || item.item_type === "Server";

    async function flash(label) {
        setDone(label);
        setTimeout(() => setDone(""), 1500);
        setOpen(false);
    }

    async function doConnection() {
        try {
            await copyConnectionString(item.id, clearAfter);
            flash("conn");
        } catch (err) {
            alert(String(err));
        }
    }

    if (!canConn) return null;

    return (

        <div className="relative" ref={ref}>

            <button
                onClick={() => setOpen(!open)}
                title="Copiar en otro formato"
                className="flex items-center gap-1 text-sm font-medium h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition"
            >
                {done ? <Check size={15} className="text-emerald-500" /> : <ClipboardCopy size={15} />}
                <ChevronDown size={13} />
            </button>

            {open && (
                <div className="absolute right-0 mt-1 w-56 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl z-20 py-1">
                    <button
                        onClick={doConnection}
                        className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 transition-colors"
                    >
                        Copiar connection string
                    </button>
                </div>
            )}

        </div>

    );

}
