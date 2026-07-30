use std::fs;
use std::path::PathBuf;

use tauri::{AppHandle, Manager};
use tauri::path::BaseDirectory;

use serde_json::{from_str, to_string_pretty};

use crate::models::vault::Vault;

pub struct Storage;

impl Storage {
    pub fn vault_path(app: &AppHandle) -> Result<PathBuf, String> {
        let path = app
            .path()
            .resolve("vault.json", BaseDirectory::AppConfig)
            .map_err(|e| e.to_string())?;

        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }

        Ok(path)
    }

    pub fn exists(app: &AppHandle) -> Result<bool, String> {
        Ok(Self::vault_path(app)?.exists())
    }

    pub fn create(app: &AppHandle) -> Result<(), String> {
        let vault = Vault {
            nodes: Vec::new(),
            items: Vec::new(),
        };

        let json = to_string_pretty(&vault).map_err(|e| e.to_string())?;

        fs::write(Self::vault_path(app)?, json)
            .map_err(|e| e.to_string())?;

        Ok(())
    }

    pub fn load(app: &AppHandle) -> Result<Vault, String> {
        let data = fs::read_to_string(Self::vault_path(app)?)
            .map_err(|e| e.to_string())?;

        let vault: Vault =
            from_str(&data).map_err(|e| e.to_string())?;

        Ok(vault)
    }

    pub fn save(
        app: &AppHandle,
        vault: &Vault,
    ) -> Result<(), String> {

        let json =
            to_string_pretty(vault).map_err(|e| e.to_string())?;

        fs::write(Self::vault_path(app)?, json)
            .map_err(|e| e.to_string())?;

        Ok(())
    }
}