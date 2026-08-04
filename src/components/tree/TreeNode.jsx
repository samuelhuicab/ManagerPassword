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

    const isSelected = selectedNode?.id === node.id;

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

        if (isSelected) {

            setSelectedNode(null);

        }

        await reloadNodes();

    }

    return (

        <>

            <div

                onClick={handleSelect}

                style={{
                    paddingLeft: `${level * 16 + 12}px`
                }}

                className={`

                    relative

                    h-9

                    flex

                    items-center

                    gap-2

                    cursor-pointer

                    text-sm

                    select-none

                    group

                    border-l-2

                    transition-colors

                    ${

                        isSelected

                        ? "bg-zinc-900 text-white border-blue-500"

                        : "text-zinc-400 border-transparent hover:bg-zinc-900/60 hover:text-zinc-200"

                    }

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

                                <ChevronDown size={14}/>

                            :

                                <ChevronRight size={14}/>

                        :

                            null

                    }

                </div>

                {

                    node.expanded

                    ?

                        <FolderOpen size={16} className="shrink-0"/>

                    :

                        <Folder size={16} className="shrink-0"/>

                }

                <span className="truncate flex-1">

                    {node.name}

                </span>

                <button

                    onClick={handleDelete}

                    title="Eliminar carpeta"

                    className="

                        opacity-0

                        group-hover:opacity-100

                        shrink-0

                        w-6

                        h-6

                        mr-2

                        rounded

                        flex

                        items-center

                        justify-center

                        text-zinc-500

                        hover:text-red-500

                        hover:bg-zinc-800

                        transition

                    "

                >

                    <Trash2 size={13}/>

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