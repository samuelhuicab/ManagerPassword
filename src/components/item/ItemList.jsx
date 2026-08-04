import { useEffect } from "react";
import { Star, Plus, Inbox } from "lucide-react";

import useVault from "../../hooks/useVault";

import { getTypeIcon, getTypeLabel } from "../../constants/itemTypes";

export default function ItemList() {

    const {

        selectedNode,

        items,

        selectedItem,

        setSelectedItem,

        loadItems,

        openCreateItemModal,

    } = useVault();

    useEffect(() => {

        if (!selectedNode)
            return;

        loadItems(selectedNode.id);

    }, [selectedNode]);

    return (

        <aside

            className="

                w-80

                bg-zinc-950

                border-r

                border-zinc-800

                flex

                flex-col

            "

        >

            <div

                className="

                    h-12

                    border-b

                    border-zinc-800

                    flex

                    items-center

                    justify-between

                    px-4

                "

            >

                <span

                    className="

                        text-sm

                        font-semibold

                        text-white

                        truncate

                    "

                >

                    {selectedNode?.name}

                </span>

                <button

                    onClick={() => selectedNode && openCreateItemModal(selectedNode.id)}

                    title="Nuevo elemento"

                    className="

                        w-7

                        h-7

                        rounded-md

                        flex

                        items-center

                        justify-center

                        shrink-0

                        text-zinc-400

                        hover:text-white

                        hover:bg-zinc-800

                        transition

                    "

                >

                    <Plus size={16} />

                </button>

            </div>

            <div

                className="

                    flex-1

                    overflow-auto

                    p-2

                    space-y-1

                "

            >

                {

                    items.length === 0 &&

                    <div

                        className="

                            flex

                            flex-col

                            items-center

                            text-center

                            gap-3

                            py-12

                            px-4

                        "

                    >

                        <div

                            className="

                                w-11

                                h-11

                                rounded-lg

                                bg-zinc-900

                                border

                                border-zinc-800

                                flex

                                items-center

                                justify-center

                                text-zinc-600

                            "

                        >

                            <Inbox size={18} />

                        </div>

                        <p className="text-sm text-zinc-500">

                            No hay elementos en esta carpeta.

                        </p>

                    </div>

                }

                {

                    items.map(item => {

                        const Icon = getTypeIcon(item.item_type);

                        const isSelected = selectedItem?.id === item.id;

                        return (

                            <div

                                key={item.id}

                                onClick={() => setSelectedItem(item)}

                                className={`

                                    flex

                                    items-center

                                    gap-3

                                    px-3

                                    py-2.5

                                    rounded-lg

                                    cursor-pointer

                                    transition-colors

                                    border

                                    ${

                                        isSelected

                                        ? "bg-zinc-900 border-zinc-700"

                                        : "border-transparent hover:bg-zinc-900/60"

                                    }

                                `}

                            >

                                <div

                                    className={`

                                        w-9

                                        h-9

                                        rounded-lg

                                        border

                                        flex

                                        items-center

                                        justify-center

                                        shrink-0

                                        ${

                                            isSelected

                                            ? "bg-zinc-800 border-zinc-700 text-blue-400"

                                            : "bg-zinc-900 border-zinc-800 text-zinc-500"

                                        }

                                    `}

                                >

                                    <Icon size={16} />

                                </div>

                                <div className="min-w-0 flex-1">

                                    <div

                                        className={`

                                            text-sm

                                            truncate

                                            ${isSelected ? "text-white" : "text-zinc-300"}

                                        `}

                                    >

                                        {item.title}

                                    </div>

                                    <div className="text-xs text-zinc-500 truncate">

                                        {getTypeLabel(item.item_type)}

                                    </div>

                                </div>

                                {

                                    item.favorite &&

                                    <Star

                                        size={13}

                                        className="shrink-0"

                                        fill="#EAB308"

                                        color="#EAB308"

                                    />

                                }

                            </div>

                        );

                    })

                }

            </div>

        </aside>

    );

}