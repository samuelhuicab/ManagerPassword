use tauri::AppHandle;

use crate::{
    models::node::{Node, NodeType},
    services::node_service::NodeService,
};

#[tauri::command]
pub fn get_nodes(
    app: AppHandle,
) -> Result<Vec<Node>, String> {

    NodeService::get_all(&app)
}

#[tauri::command]
pub fn create_node(
    app: AppHandle,
    name: String,
    parent_id: Option<String>,
    node_type: NodeType,
) -> Result<Node, String> {

    NodeService::create(
        &app,
        name,
        parent_id,
        node_type,
    )
}

#[tauri::command]
pub fn rename_node(
    app: AppHandle,
    id: String,
    name: String,
) -> Result<(), String> {

    NodeService::rename(
        &app,
        id,
        name,
    )
}

#[tauri::command]
pub fn toggle_node(
    app: AppHandle,
    id: String,
) -> Result<(), String> {

    NodeService::toggle(
        &app,
        id,
    )
}

#[tauri::command]
pub fn delete_node(
    app: AppHandle,
    id: String,
) -> Result<(), String> {

    NodeService::delete(
        &app,
        id,
    )
}

#[tauri::command]
pub fn move_node(
    app: AppHandle,
    id: String,
    parent_id: Option<String>,
) -> Result<(), String> {

    NodeService::move_node(
        &app,
        id,
        parent_id,
    )

}