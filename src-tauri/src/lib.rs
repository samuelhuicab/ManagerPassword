mod commands;
mod models;
mod services;
mod storage;

use std::process::Command;

#[tauri::command]
fn open_ssh(ip: String, user: String) -> Result<(), String> {
    let cmd = format!("ssh {}@{}", user, ip);

    if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(["/C", &format!("start powershell -NoExit {}", cmd)])
            .spawn()
            .map_err(|e| e.to_string())?;
    } else if cfg!(target_os = "macos") {
        Command::new("osascript")
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
        if Command::new("gnome-terminal")
            .args(["--", "bash", "-c", &format!("{}; exec bash", cmd)])
            .spawn()
            .is_ok()
        {
            return Ok(());
        }

        if Command::new("konsole")
            .args(["-e", "bash", "-c", &cmd])
            .spawn()
            .is_ok()
        {
            return Ok(());
        }

        Command::new("xterm")
            .args(["-hold", "-e", &cmd])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::vault::init_vault,
            commands::vault::load_vault,
            commands::vault::save_vault,

            commands::node::get_nodes,
            commands::node::create_node,
            commands::node::rename_node,
            commands::node::toggle_node,
            commands::node::delete_node,
            commands::node::move_node,

            commands::item::get_items,
            commands::item::get_items_by_node,
            commands::item::create_item,
            commands::item::delete_item,
            commands::item::update_item_title,
            commands::item::update_item_notes,
            commands::item::toggle_item_favorite,
            commands::item::update_item_field,
            commands::item::move_item,
            commands::item::duplicate_item,
            commands::item::get_favorites,

            commands::search::search_items,

            open_ssh
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}