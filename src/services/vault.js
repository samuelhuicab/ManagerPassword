import { invoke } from "@tauri-apps/api/core";

/* ===========================
   VAULT
=========================== */

export async function initVault() {
    return await invoke("init_vault");
}

/* ===========================
   NODES
=========================== */

export async function getNodes() {
    return await invoke("get_nodes");
}

export async function createNode(name, parentId, nodeType) {
    return await invoke("create_node", {
        name,
        parentId,
        nodeType,
    });
}

export async function renameNode(id, name) {
    return await invoke("rename_node", {
        id,
        name,
    });
}

export async function deleteNode(id) {
    return await invoke("delete_node", {
        id,
    });
}

export async function toggleNode(id) {
    return await invoke("toggle_node", {
        id,
    });
}

export async function moveNode(id, parentId) {
    return await invoke("move_node", {
        id,
        parentId,
    });
}

/* ===========================
   ITEMS
=========================== */

export async function getItemsByNode(nodeId) {
    return await invoke("get_items_by_node", {
        nodeId,
    });
}

export async function createItem(nodeId, title, itemType) {
    return await invoke("create_item", {
        nodeId,
        title,
        itemType,
    });
}

export async function deleteItem(id) {
    return await invoke("delete_item", {
        id,
    });
}

export async function duplicateItem(id) {
    return await invoke("duplicate_item", {
        id,
    });
}

export async function updateItemTitle(id, title) {
    return await invoke("update_item_title", {
        id,
        title,
    });
}

export async function updateItemNotes(id, notes) {
    return await invoke("update_item_notes", {
        id,
        notes,
    });
}

export async function updateItemField(itemId, key, value) {
    return await invoke("update_item_field", {
        itemId,
        key,
        value,
    });
}

export async function toggleFavorite(id) {
    return await invoke("toggle_item_favorite", {
        id,
    });
}

export async function getFavorites() {
    return await invoke("get_favorites");
}

/* ===========================
   SEARCH
=========================== */

export async function search(query) {
    return await invoke("search_items", {
        query,
    });
}

export async function openSsh(ip, user) {
    return await invoke("open_ssh", {
        ip,
        user,
    });
}