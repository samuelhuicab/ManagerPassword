import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [servers, setServers] = useState([]);
  const [form, setForm] = useState({ name: "", ip: "", user: "", pass: "" });
  const [showFormModal, setShowFormModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [toast, setToast] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({ show: false, index: null });

  // Cargar configuración inicial
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) setDarkMode(theme === "dark");

    (async () => {
      try {
        await invoke("init_servers_file");
        const data = await invoke("read_servers");
        setServers(data);
      } catch {
        showToast("Error al cargar servidores");
      }
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleSave = async () => {
    if (!form.name || !form.ip || !form.user || !form.pass) {
      showToast("Completa todos los campos");
      return;
    }

    const updated = [...servers];
    if (editIndex !== null) updated[editIndex] = form;
    else updated.push(form);

    try {
      await invoke("save_servers", { servers: updated });
      setServers(updated);
      setForm({ name: "", ip: "", user: "", pass: "" });
      setShowFormModal(false);
      setEditIndex(null);
      showToast(editIndex !== null ? "Servidor actualizado" : "Servidor guardado");
    } catch {
      showToast("Error al guardar servidor");
    }
  };

  const handleEdit = (srv, index) => {
    setForm(srv);
    setEditIndex(index);
    setShowFormModal(true);
  };

  const handleDelete = async () => {
    const index = confirmDelete.index;
    if (index === null) return;

    try {
      const data = await invoke("delete_server", { index });
      setServers(data);
      showToast("Servidor eliminado");
    } catch {
      showToast("Error eliminando servidor");
    } finally {
      setConfirmDelete({ show: false, index: null });
    }
  };

  const handleSSH = async (ip, user) => {
    try {
      await invoke("open_ssh", { ip, user });
    } catch {
      showToast("Error al conectar");
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Contraseña copiada");
    } catch {
      showToast("Error al copiar contraseña");
    }
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center p-8 transition-colors duration-300 ${
        darkMode
          ? "bg-[#0e1217] text-gray-200"
          : "bg-gray-50 text-gray-800"
      } font-sans`}
    >
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center">
          <h1
            className={`text-2xl font-semibold ${
              darkMode ? "text-gray-100" : "text-gray-700"
            }`}
          >
            SSH Manager
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-1.5 rounded-md border text-sm transition ${
                darkMode
                  ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {darkMode ? "Claro" : "Oscuro"}
            </button>
            <button
              onClick={() => {
                setForm({ name: "", ip: "", user: "", pass: "" });
                setEditIndex(null);
                setShowFormModal(true);
              }}
              className={`px-3 py-1.5 rounded-md text-sm transition ${
                darkMode
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white"
              }`}
            >
              Nuevo
            </button>
          </div>
        </header>

        {/* Lista */}
        <div
          className={`rounded-2xl p-6 border transition ${
            darkMode
              ? "bg-[#161b22] border-gray-800"
              : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-sm font-medium mb-4 opacity-70">
            Servidores guardados
          </h2>

          {servers.length === 0 ? (
            <p className="text-center text-gray-400 py-6 text-sm">
              No hay servidores aún
            </p>
          ) : (
            <div className="space-y-2">
              {servers.map((srv, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg border transition ${
                    darkMode
                      ? "border-gray-700 hover:border-indigo-600/60 bg-[#0e1217]"
                      : "border-gray-200 hover:border-indigo-400/50 bg-gray-50"
                  }`}
                >
                  <div>
                    <p className="font-medium text-sm">{srv.name}</p>
                    <p className="text-xs opacity-70">{srv.user}@{srv.ip}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSSH(srv.ip, srv.user)}
                      className="text-xs px-3 py-1 border border-transparent bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                    >
                      Conectar
                    </button>
                    <button
                      onClick={() => handleCopy(srv.pass)}
                      className="text-xs px-3 py-1 border border-transparent bg-gray-600 hover:bg-gray-700 text-white rounded-md"
                    >
                      Copiar
                    </button>
                    <button
                      onClick={() => handleEdit(srv, i)}
                      className="text-xs px-3 py-1 border border-transparent bg-slate-600 hover:bg-slate-700 text-white rounded-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete({ show: true, index: i })}
                      className="text-xs px-3 py-1 border border-transparent bg-red-600 hover:bg-red-700 text-white rounded-md"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-sm px-4 py-2 rounded-md shadow-md transition ${
              darkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {toast}
          </div>
        )}
      </div>

      {/* Modal Formulario */}
      {showFormModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 animate-fadeIn">
          <div
            className={`w-[90%] max-w-md rounded-2xl p-6 border transition ${
              darkMode
                ? "bg-[#161b22] border-gray-700 text-gray-200"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">
              {editIndex !== null ? "Editar Servidor" : "Nuevo Servidor"}
            </h2>

            <div className="space-y-3">
              <input
                placeholder="Nombre"
                className={`w-full px-3 py-2 rounded-md border text-sm outline-none ${
                  darkMode
                    ? "bg-[#0e1217] border-gray-700 focus:ring-1 focus:ring-indigo-600"
                    : "bg-gray-50 border-gray-300 focus:ring-1 focus:ring-indigo-400"
                }`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="IP o dominio"
                className={`w-full px-3 py-2 rounded-md border text-sm outline-none ${
                  darkMode
                    ? "bg-[#0e1217] border-gray-700 focus:ring-1 focus:ring-indigo-600"
                    : "bg-gray-50 border-gray-300 focus:ring-1 focus:ring-indigo-400"
                }`}
                value={form.ip}
                onChange={(e) => setForm({ ...form, ip: e.target.value })}
              />
              <input
                placeholder="Usuario"
                className={`w-full px-3 py-2 rounded-md border text-sm outline-none ${
                  darkMode
                    ? "bg-[#0e1217] border-gray-700 focus:ring-1 focus:ring-indigo-600"
                    : "bg-gray-50 border-gray-300 focus:ring-1 focus:ring-indigo-400"
                }`}
                value={form.user}
                onChange={(e) => setForm({ ...form, user: e.target.value })}
              />
              <input
                placeholder="Contraseña"
                type="password"
                className={`w-full px-3 py-2 rounded-md border text-sm outline-none ${
                  darkMode
                    ? "bg-[#0e1217] border-gray-700 focus:ring-1 focus:ring-indigo-600"
                    : "bg-gray-50 border-gray-300 focus:ring-1 focus:ring-indigo-400"
                }`}
                value={form.pass}
                onChange={(e) => setForm({ ...form, pass: e.target.value })}
              />
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setShowFormModal(false)}
                className={`px-4 py-2 rounded-md text-sm ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
              >
                {editIndex !== null ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación de Eliminación */}
      {confirmDelete.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn">
          <div
            className={`w-[90%] max-w-sm rounded-2xl p-6 border text-center ${
              darkMode
                ? "bg-[#161b22] border-gray-700 text-gray-200"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <p className="mb-6 text-sm">
              ¿Seguro que deseas eliminar este servidor?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setConfirmDelete({ show: false, index: null })}
                className={`px-4 py-2 rounded-md text-sm ${
                  darkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
