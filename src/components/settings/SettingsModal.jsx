import { useEffect, useState } from "react";

import { save as saveDialog, open as openDialog } from "@tauri-apps/plugin-dialog";

import Modal from "../ui/Modal";
import Button from "../ui/Button";

import { useAuth } from "../../contexts/AuthContext";
import {
    getSettings,
    updateSettings,
    changeMasterPassword,
    forgetKeychain,
} from "../../services/auth";
import { exportBackup, importBackup } from "../../services/dev";

const LOCK_OPTIONS = [
    { v: 0, label: "Nunca" },
    { v: 60, label: "1 minuto" },
    { v: 300, label: "5 minutos" },
    { v: 600, label: "10 minutos" },
    { v: 1800, label: "30 minutos" },
];

export default function SettingsModal({ onClose }) {

    const { hasKeychain, refresh, lock } = useAuth();

    const [settings, setSettings] = useState(null);
    const [msg, setMsg] = useState("");

    const [cur, setCur] = useState("");
    const [next, setNext] = useState("");
    const [next2, setNext2] = useState("");

    useEffect(() => {
        getSettings().then(setSettings).catch(() => setSettings({
            autoLockSeconds: 300,
            rememberDevice: false,
            clipboardClearSeconds: 20,
        }));
    }, []);

    if (!settings) return null;

    async function persist(patch) {
        const updated = { ...settings, ...patch };
        setSettings(updated);
        await updateSettings(updated);
    }

    async function handleChangePassword() {
        setMsg("");
        if (next.length < 8) return setMsg("La nueva contraseña necesita 8+ caracteres.");
        if (next !== next2) return setMsg("Las contraseñas nuevas no coinciden.");
        try {
            await changeMasterPassword(cur, next);
            setCur(""); setNext(""); setNext2("");
            setMsg("Contraseña maestra actualizada.");
        } catch (err) {
            setMsg(String(err));
        }
    }

    async function handleForget() {
        await forgetKeychain();
        await refresh();
        setMsg("Se olvidó la clave de este equipo.");
    }

    async function handleExportBackup() {
        setMsg("");
        const pw = prompt("Contraseña para el backup (mín. 8):");
        if (!pw) return;
        const path = await saveDialog({
            defaultPath: "passcontroller-backup.vault",
            filters: [{ name: "Vault", extensions: ["vault"] }],
        });
        if (!path) return;
        try {
            await exportBackup(path, pw);
            setMsg("Backup exportado.");
        } catch (err) {
            setMsg(String(err));
        }
    }

    async function handleImportBackup() {
        setMsg("");
        if (!confirm("Importar reemplaza TODO el contenido actual del vault. ¿Seguir?")) return;
        const path = await openDialog({
            multiple: false,
            filters: [{ name: "Vault", extensions: ["vault"] }],
        });
        if (!path) return;
        const pw = prompt("Contraseña del backup:");
        if (!pw) return;
        try {
            await importBackup(path, pw);
            setMsg("Backup importado. Se bloqueará para recargar.");
            setTimeout(() => lock(), 900);
        } catch (err) {
            setMsg(String(err));
        }
    }

    return (

        <Modal title="Ajustes" onClose={onClose}>

            <div className="space-y-6">

                <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                        Bloqueo automático por inactividad
                    </label>
                    <select
                        value={settings.autoLockSeconds}
                        onChange={(e) => persist({ autoLockSeconds: Number(e.target.value) })}
                        className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-500"
                    >
                        {LOCK_OPTIONS.map((o) => (
                            <option key={o.v} value={o.v}>{o.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                        Limpiar portapapeles tras copiar un secreto
                    </label>
                    <select
                        value={settings.clipboardClearSeconds}
                        onChange={(e) => persist({ clipboardClearSeconds: Number(e.target.value) })}
                        className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-sm text-white outline-none focus:border-blue-500"
                    >
                        <option value={0}>Nunca</option>
                        <option value={10}>10 segundos</option>
                        <option value={20}>20 segundos</option>
                        <option value={45}>45 segundos</option>
                        <option value={90}>90 segundos</option>
                    </select>
                </div>

                {hasKeychain && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-zinc-400">
                            Clave recordada en el llavero del sistema
                        </span>
                        <Button variant="secondary" onClick={handleForget}>
                            Olvidar
                        </Button>
                    </div>
                )}

                <div className="border-t border-zinc-800 pt-5">
                    <h3 className="text-sm font-semibold text-white mb-3">
                        Cambiar contraseña maestra
                    </h3>
                    <div className="space-y-2">
                        <input type="password" placeholder="Actual" value={cur}
                            onChange={(e) => setCur(e.target.value)}
                            className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-500" />
                        <input type="password" placeholder="Nueva" value={next}
                            onChange={(e) => setNext(e.target.value)}
                            className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-500" />
                        <input type="password" placeholder="Repetir nueva" value={next2}
                            onChange={(e) => setNext2(e.target.value)}
                            className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-sm text-white outline-none focus:border-blue-500" />
                        <Button variant="secondary" onClick={handleChangePassword}>
                            Actualizar contraseña
                        </Button>
                    </div>
                </div>

                <div className="border-t border-zinc-800 pt-5">
                    <h3 className="text-sm font-semibold text-white mb-3">
                        Backup cifrado
                    </h3>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={handleExportBackup}>
                            Exportar
                        </Button>
                        <Button variant="secondary" onClick={handleImportBackup}>
                            Importar
                        </Button>
                    </div>
                </div>

                {msg && (
                    <div className="text-sm text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2">
                        {msg}
                    </div>
                )}

            </div>

        </Modal>

    );

}
