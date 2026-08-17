use tauri::AppHandle;

use crate::{
    models::search_result::SearchResult,
    services::search_service::SearchService,
};

#[tauri::command]
pub fn search_items(
    app: AppHandle,
    query: String,
) -> Result<Vec<SearchResult>, String> {

    SearchService::search(
        &app,
        query,
    )

}