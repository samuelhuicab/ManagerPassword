import { useEffect } from "react";
import {
    Server,
    Database,
    Mail,
    Globe,
    KeyRound,
    FileText,
    Star,
    Plus
} from "lucide-react";

import useVault from "../../hooks/useVault";

function getIcon(type) {

    switch (type) {

        case "Server":
            return <Server size={18} />;

        case "Database":
            return <Database size={18} />;

        case "Email":
            return <Mail size={18} />;

        case "Website":
            return <Globe size={18} />;

        case "License":
            return <KeyRound size={18} />;

        default:
            return <FileText size={18} />;

    }

}

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

                bg-zinc-900

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

                        text-zinc-300

                    "

                >

                    {selectedNode?.name}

                </span>

                <button

                    onClick={() => selectedNode && openCreateItemModal(selectedNode.id)}

                    className="

                        w-8

                        h-8

                        rounded

                        hover:bg-zinc-800

                        flex

                        items-center

                        justify-center

                    "

                >

                    <Plus size={18} />

                </button>

            </div>

            <div

                className="

                    flex-1

                    overflow-auto

                "

            >

                {

                    items.length === 0 &&

                    <div

                        className="

                            p-8

                            text-center

                            text-zinc-500

                        "

                    >

                        No existen elementos.

                    </div>

                }

                {

                    items.map(item => (

                        <div

                            key={item.id}

                            onClick={() => setSelectedItem(item)}

                            className={`

                                px-4

                                py-3

                                border-b

                                border-zinc-800

                                cursor-pointer

                                transition-colors

                                hover:bg-zinc-800

                                ${selectedItem?.id === item.id ? "bg-zinc-800" : ""}

                            `}

                        >

                            <div

                                className="

                                    flex

                                    items-center

                                    justify-between

                                "

                            >

                                <div

                                    className="

                                        flex

                                        items-center

                                        gap-3

                                    "

                                >

                                    {getIcon(item.item_type)}

                                    <span className="text-white">

                                        {item.title}

                                    </span>

                                </div>

                                {

                                    item.favorite &&

                                    <Star

                                        size={15}

                                        fill="#EAB308"

                                        color="#EAB308"

                                    />

                                }

                            </div>

                            <div

                                className="

                                    mt-1

                                    text-xs

                                    text-zinc-500

                                "

                            >

                                {item.item_type}

                            </div>

                        </div>

                    ))

                }

            </div>

        </aside>

    );

}