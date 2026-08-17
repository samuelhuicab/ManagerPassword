use serde::{Deserialize, Serialize};

use crate::models::item::VaultItem;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SearchResult {
    pub item: VaultItem,
    pub matched_field: String,
}