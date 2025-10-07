use std::fs;
use tauri::{AppHandle, Manager};
use tauri::path::BaseDirectory;
use serde::{Serialize, Deserialize};
use serde_json::{from_str, to_string_pretty};

#[derive(Serialize, Deserialize, Clone)]
struct Server {
    name: String,
    ip: String,
    user: String,
    pass: String,
}

// ---------- Utilidad: obtener ruta segura del archivo ----------
fn get_servers_path(app_handle: &AppHandle) -> Result<std::path::PathBuf, String> {
    let path = app_handle
        .path()
        .resolve("servers.json", BaseDirectory::AppConfig)
        .map_err(|e| e.to_string())?;

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| e.to_string())?;
    }

    if !path.exists() {
        fs::write(&path, "[]").map_err(|e| e.to_string())?;
    }

    Ok(path)
}

// ---------- Crear archivo si no existe ----------
#[tauri::command]
fn init_servers_file(app_handle: AppHandle) -> Result<String, String> {
    let path = get_servers_path(&app_handle)?;
    Ok(path.to_string_lossy().to_string())
}

// ---------- Leer servidores ----------
#[tauri::command]
fn read_servers(app_handle: AppHandle) -> Result<Vec<Server>, String> {
    let path = get_servers_path(&app_handle)?;
    let data = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let servers: Vec<Server> = from_str(&data).unwrap_or_default();
    Ok(servers)
}

// ---------- Guardar servidores ----------
#[tauri::command]
fn save_servers(app_handle: AppHandle, servers: Vec<Server>) -> Result<(), String> {
    let path = get_servers_path(&app_handle)?;
    let json = to_string_pretty(&servers).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

// ---------- Eliminar un servidor ----------
#[tauri::command]
fn delete_server(app_handle: AppHandle, index: usize) -> Result<Vec<Server>, String> {
    let path = get_servers_path(&app_handle)?;
    let data = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let mut servers: Vec<Server> = from_str(&data).unwrap_or_default();

    if index < servers.len() {
        servers.remove(index);
    }

    let json = to_string_pretty(&servers).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;
    Ok(servers)
}

// ---------- Abrir conexión SSH (multiplataforma) ----------
#[tauri::command]
fn open_ssh(ip: String, user: String) -> Result<(), String> {
    let cmd = format!("ssh {}@{}", user, ip);

    if cfg!(target_os = "windows") {
        std::process::Command::new("cmd")
            .args(["/C", &format!("start powershell -NoExit {}", cmd)])
            .spawn()
            .map_err(|e| e.to_string())?;
    } else if cfg!(target_os = "macos") {
        std::process::Command::new("osascript")
            .args([
                "-e",
                &format!(
                    "tell application \"Terminal\" to do script \"{}\"",
                    cmd.replace('"', "\\\"")
                ),
            ])
            .spawn()
            .map_err(|e| e.to_string())?;
    } else {
        if std::process::Command::new("gnome-terminal")
            .args(["--", "bash", "-c", &format!("{}; exec bash", cmd)])
            .spawn()
            .is_ok()
        {
            return Ok(());
        }
        if std::process::Command::new("konsole")
            .args(["-e", "bash", "-c", &cmd])
            .spawn()
            .is_ok()
        {
            return Ok(());
        }
        std::process::Command::new("xterm")
            .args(["-hold", "-e", &cmd])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

// ---------- Inicialización ----------
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            init_servers_file,
            read_servers,
            save_servers,
            delete_server,
            open_ssh
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
