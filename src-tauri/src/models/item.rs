use serde::{Deserialize, Serialize};

use crate::models::{
    field::Field,
    item_type::ItemType,
};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct VaultItem {
    pub id: String,
    pub node_id: String,
    pub title: String,
    pub item_type: ItemType,
    pub favorite: bool,
    pub notes: String,
    pub created_at: String,
    pub updated_at: String,
    pub fields: Vec<Field>,
}