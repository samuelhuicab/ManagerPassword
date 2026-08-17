use uuid::Uuid;

use tauri::AppHandle;

use crate::{
    models::node::{Node, NodeType},
    services::vault_service::VaultService,
};

pub struct NodeService;

impl NodeService {
    pub fn get_all(app: &AppHandle) -> Result<Vec<Node>, String> {
        Ok(VaultService::load(app)?.nodes)
    }

    pub fn create(
        app: &AppHandle,
        name: String,
        parent_id: Option<String>,
        node_type: NodeType,
    ) -> Result<Node, String> {

        let mut vault = VaultService::load(app)?;

        let order = vault
            .nodes
            .iter()
            .filter(|n| n.parent_id == parent_id)
            .count() as i32;

        let node = Node {
            id: Uuid::new_v4().to_string(),
            name,
            parent_id,
            node_type,
            icon: None,
            order,
            expanded: true,
        };

        vault.nodes.push(node.clone());
        VaultService::save(app, &vault)?;
        Ok(node)
    }

    pub fn rename(
        app: &AppHandle,
        id: String,
        name: String,
    ) -> Result<(), String> {

        let mut vault = VaultService::load(app)?;

        let node = vault
            .nodes
            .iter_mut()
            .find(|n| n.id == id)
            .ok_or("Nodo no encontrado")?;

        node.name = name;

        VaultService::save(app, &vault)
    }

    pub fn toggle(
        app: &AppHandle,
        id: String,
    ) -> Result<(), String> {

        let mut vault = VaultService::load(app)?;

        let node = vault
            .nodes
            .iter_mut()
            .find(|n| n.id == id)
            .ok_or("Nodo no encontrado")?;

        node.expanded = !node.expanded;

        VaultService::save(app, &vault)
    }

    pub fn delete(
        app: &AppHandle,
        id: String,
    ) -> Result<(), String> {

        let mut vault = VaultService::load(app)?;

        // Recolectamos TODOS los ids que van a borrarse (el nodo + toda su descendencia)
        // para poder limpiar también los items que cuelgan de las subcarpetas.
        let mut deleted_ids: Vec<String> = vec![id.clone()];

        Self::collect_descendants(&vault.nodes, &id, &mut deleted_ids);

        vault.nodes.retain(|n| !deleted_ids.contains(&n.id));

        vault.items.retain(|i| !deleted_ids.contains(&i.node_id));

        VaultService::save(app, &vault)
    }

    fn collect_descendants(
        nodes: &[Node],
        id: &str,
        acc: &mut Vec<String>,
    ) {
        let children: Vec<String> = nodes
            .iter()
            .filter(|n| n.parent_id.as_deref() == Some(id))
            .map(|n| n.id.clone())
            .collect();

        for child in children {
            acc.push(child.clone());
            Self::collect_descendants(nodes, &child, acc);
        }
    }

    pub fn move_node(
        app: &AppHandle,
        id: String,
        parent_id: Option<String>,
    ) -> Result<(), String> {

        if let Some(parent) = &parent_id {

            if parent == &id {
                return Err("No puedes mover un nodo dentro de sí mismo".into());
            }

        }

        let mut vault = VaultService::load(app)?;

        let node = vault
            .nodes
            .iter_mut()
            .find(|n| n.id == id)
            .ok_or("Nodo no encontrado")?;

        node.parent_id = parent_id;

        VaultService::save(app, &vault)

    }
}