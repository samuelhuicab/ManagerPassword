use tauri::AppHandle;

use crate::{
    models::search_result::SearchResult,
    services::vault_service::VaultService,
};

pub struct SearchService;

impl SearchService {

    pub fn search(
        app: &AppHandle,
        query: String,
    ) -> Result<Vec<SearchResult>, String> {

        let vault = VaultService::load(app)?;

        let query = query.to_lowercase();

        let mut results = Vec::new();

        for item in vault.items {

            if item.title.to_lowercase().contains(&query) {

                results.push(SearchResult {
                    item,
                    matched_field: "title".into(),
                });

                continue;
            }

            if item.notes.to_lowercase().contains(&query) {

                results.push(SearchResult {
                    item,
                    matched_field: "notes".into(),
                });

                continue;
            }

            let mut found = false;

            for field in &item.fields {

                if field.value.to_lowercase().contains(&query) {

                    found = true;

                    results.push(SearchResult {

                        item: item.clone(),

                        matched_field: field.label.clone(),

                    });

                    break;

                }

            }

            if found {
                continue;
            }

        }

        Ok(results)

    }

}