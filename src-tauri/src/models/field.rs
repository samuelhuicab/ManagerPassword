use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Field {
    pub id:String,
    pub key:String,
    pub label:String,
    pub value:String,
    pub hidden:bool,
}