use tauri::AppHandle;

use crate::{
    models::vault::Vault,
    services::vault_service::VaultService,
};

#[tauri::command]
pub fn init_vault(
    app: AppHandle,
) -> Result<(), String> {

    VaultService::init(&app)
}

#[tauri::command]
pub fn load_vault(
    app: AppHandle,
) -> Result<Vault, String> {

    VaultService::load(&app)
}

#[tauri::command]
pub fn save_vault(
    app: AppHandle,
    vault: Vault,
) -> Result<(), String> {

    VaultService::save(&app, &vault)
}