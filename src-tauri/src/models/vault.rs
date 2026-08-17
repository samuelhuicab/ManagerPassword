use serde::{Deserialize, Serialize};

use crate::models::{
    item::VaultItem,
    node::Node,
};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Vault {
    pub nodes: Vec<Node>,
    pub items: Vec<VaultItem>,
}