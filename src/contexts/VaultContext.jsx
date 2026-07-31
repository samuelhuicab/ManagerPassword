import { createContext, useContext, useEffect, useState } from "react";

import {
    initVault,
    getNodes,
    getItemsByNode,
    createNode as createNodeService,
    createItem as createItemService,
} from "../services/vault";

const VaultContext = createContext(null);

export function VaultProvider({ children }) {

    const [loading, setLoading] = useState(true);

    const [nodes, setNodes] = useState([]);

    const [items, setItems] = useState([]);

    const [selectedNode, setSelectedNode] = useState(null);

    const [selectedItem, setSelectedItem] = useState(null);

    // Modal state
    const [createNodeModal, setCreateNodeModal] = useState({ open: false, parentId: null });

    const [createItemModal, setCreateItemModal] = useState({ open: false, nodeId: null });

    async function reloadNodes() {

        const data = await getNodes();

        setNodes(data);

    }

    async function loadItems(nodeId) {

        if (!nodeId) {

            setItems([]);

            return;

        }

        const data = await getItemsByNode(nodeId);

        setItems(data);

    }

    async function initialize() {

        try {

            setLoading(true);

            await initVault();

            const data = await getNodes();

            setNodes(data);

        } finally {

            setLoading(false);

        }

    }

    async function createNodeAction(name, parentId, nodeType) {

        const node = await createNodeService(name, parentId, nodeType);

        await reloadNodes();

        setCreateNodeModal({ open: false, parentId: null });

        return node;

    }

    async function createItemAction(nodeId, title, itemType) {

        const item = await createItemService(nodeId, title, itemType);

        await loadItems(nodeId);

        setCreateItemModal({ open: false, nodeId: null });

        setSelectedItem(item);

        return item;

    }

    function openCreateNodeModal(parentId = null) {

        setCreateNodeModal({ open: true, parentId });

    }

    function openCreateItemModal(nodeId) {

        setCreateItemModal({ open: true, nodeId });

    }

    useEffect(() => {

        initialize();

    }, []);

    useEffect(() => {

        if (!selectedNode) {

            setItems([]);

            setSelectedItem(null);

            return;

        }

        loadItems(selectedNode.id);

    }, [selectedNode]);

    const value = {

        loading,

        nodes,

        items,

        selectedNode,

        selectedItem,

        setSelectedNode,

        setSelectedItem,

        reloadNodes,

        loadItems,

        createNodeAction,

        createItemAction,

        createNodeModal,

        createItemModal,

        openCreateNodeModal,

        openCreateItemModal,

        closeCreateNodeModal: () => setCreateNodeModal({ open: false, parentId: null }),

        closeCreateItemModal: () => setCreateItemModal({ open: false, nodeId: null }),

    };

    return (

        <VaultContext.Provider value={value}>

            {children}

        </VaultContext.Provider>

    );

}

export function useVault() {

    return useContext(VaultContext);

}