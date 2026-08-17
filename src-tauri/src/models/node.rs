use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq)]
pub enum NodeType {
    Category,
    Folder,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Node {
    pub id: String,
    pub name: String,
    pub parent_id: Option<String>,
    pub node_type: NodeType,
    pub icon: Option<String>,
    pub order: i32,
    pub expanded: bool,
}