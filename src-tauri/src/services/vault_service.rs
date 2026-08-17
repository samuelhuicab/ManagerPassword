use tauri::AppHandle;

use crate::{
    models::vault::Vault,
    storage::storage::Storage,
};

pub struct VaultService;

impl VaultService {
    pub fn init(app: &AppHandle) -> Result<(), String> {
        if !Storage::exists(app)? {
            Storage::create(app)?;
        }

        Ok(())
    }

    pub fn load(app: &AppHandle) -> Result<Vault, String> {
        Storage::load(app)
    }

    pub fn save(
        app: &AppHandle,
        vault: &Vault,
    ) -> Result<(), String> {

        Storage::save(app, vault)
    }
}