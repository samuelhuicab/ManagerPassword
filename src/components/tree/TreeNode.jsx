import {
    ChevronDown,
    ChevronRight,
    Folder,
    FolderOpen,
    Trash2,
} from "lucide-react";

import useVault from "../../hooks/useVault";

import {
    toggleNode,
    deleteNode,
} from "../../services/vault";

export default function TreeNode({

    node,
    level

}) {

    const {

        nodes,
        selectedNode,
        setSelectedNode,
        reloadNodes

    } = useVault();

    const children = nodes.filter(

        n => n.parent_id === node.id

    );

    async function handleExpand(e) {

        e.stopPropagation();

        if (children.length === 0)
            return;

        await toggleNode(node.id);

        await reloadNodes();

    }

    function handleSelect() {

        setSelectedNode(node);

    }

    async function handleDelete(e) {

        e.stopPropagation();

        const hasChildren = children.length > 0;

        const message = hasChildren

            ? `"${node.name}" tiene subcarpetas o elementos adentro. ¿Eliminar todo de forma permanente?`

            : `¿Eliminar "${node.name}"?`;

        if (!confirm(message))
            return;

        await deleteNode(node.id);

        if (selectedNode?.id === node.id) {

            setSelectedNode(null);

        }

        await reloadNodes();

    }

    return (

        <>

            <div

                onClick={handleSelect}

                style={{
                    paddingLeft: `${level * 18 + 10}px`
                }}

                className={`

                    h-9

                    flex

                    items-center

                    gap-2

                    cursor-pointer

                    text-sm

                    select-none

                    group

                    hover:bg-zinc-800

                    ${selectedNode?.id === node.id ? "bg-zinc-800 text-white" : "text-zinc-300"}

                `}

            >

                <div

                    className="w-4 flex justify-center shrink-0"

                    onClick={handleExpand}

                >

                    {

                        children.length > 0

                        ?

                            node.expanded

                            ?

                                <ChevronDown size={15}/>

                            :

                                <ChevronRight size={15}/>

                        :

                            null

                    }

                </div>

                {

                    node.expanded

                    ?

                        <FolderOpen size={17} className="shrink-0"/>

                    :

                        <Folder size={17} className="shrink-0"/>

                }

                <span className="truncate flex-1">

                    {node.name}

                </span>

                <button

                    onClick={handleDelete}

                    className="

                        opacity-0

                        group-hover:opacity-100

                        shrink-0

                        w-7

                        h-7

                        mr-1

                        rounded

                        flex

                        items-center

                        justify-center

                        text-zinc-500

                        hover:text-red-500

                        hover:bg-zinc-700

                        transition

                    "

                >

                    <Trash2 size={14}/>

                </button>

            </div>

            {

                node.expanded &&

                children.map(child => (

                    <TreeNode

                        key={child.id}

                        node={child}

                        level={level + 1}

                    />

                ))

            }

        </>

    );

}