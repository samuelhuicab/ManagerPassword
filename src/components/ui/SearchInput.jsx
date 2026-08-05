import { useEffect, useRef, useState } from "react";

import { Search, X, Loader2 } from "lucide-react";

import { search as searchService } from "../../services/vault";

import { getTypeIcon, getTypeLabel } from "../../constants/itemTypes";

import useVault from "../../hooks/useVault";

const MATCHED_FIELD_LABEL = {

    title: "título",
    notes: "notas",

};

export default function SearchInput() {

    const { selectSearchResult } = useVault();

    const [query, setQuery] = useState("");

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const containerRef = useRef(null);

    // Debounce: espera 250ms de inactividad antes de buscar
    useEffect(() => {

        const trimmed = query.trim();

        if (trimmed.length === 0) {

            setResults([]);

            setLoading(false);

            return;

        }

        setLoading(true);

        const timeout = setTimeout(async () => {

            try {

                const data = await searchService(trimmed);

                setResults(data);

            } finally {

                setLoading(false);

            }

        }, 250);

        return () => clearTimeout(timeout);

    }, [query]);

    // Cierra el dropdown al hacer click afuera
    useEffect(() => {

        function handleClickOutside(e) {

            if (containerRef.current && !containerRef.current.contains(e.target)) {

                setOpen(false);

            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    function handleSelect(result) {

        selectSearchResult(result.item);

        setQuery("");

        setResults([]);

        setOpen(false);

    }

    function handleClear() {

        setQuery("");

        setResults([]);

    }

    const showDropdown = open && query.trim().length > 0;

    return (

        <div ref={containerRef} className="relative w-full max-w-sm">

            <Search

                size={15}

                className="

                    absolute

                    left-3

                    top-1/2

                    -translate-y-1/2

                    text-zinc-500

                    pointer-events-none

                "

            />

            <input

                value={query}

                onChange={(e) => setQuery(e.target.value)}

                onFocus={() => setOpen(true)}

                placeholder="Buscar servidores, cuentas..."

                className="

                    w-full

                    h-8

                    bg-zinc-900

                    border

                    border-zinc-800

                    rounded-lg

                    pl-9

                    pr-8

                    text-sm

                    text-white

                    outline-none

                    transition-colors

                    placeholder:text-zinc-600

                    focus:border-blue-500

                "

            />

            {

                loading &&

                <Loader2

                    size={13}

                    className="

                        absolute

                        right-2.5

                        top-1/2

                        -translate-y-1/2

                        text-zinc-500

                        animate-spin

                    "

                />

            }

            {

                !loading && query &&

                <button

                    onClick={handleClear}

                    className="

                        absolute

                        right-2

                        top-1/2

                        -translate-y-1/2

                        w-5

                        h-5

                        rounded

                        flex

                        items-center

                        justify-center

                        text-zinc-500

                        hover:text-white

                        hover:bg-zinc-800

                        transition-colors

                    "

                >

                    <X size={12} />

                </button>

            }

            {

                showDropdown &&

                <div

                    className="

                        absolute

                        top-full

                        mt-2

                        left-0

                        right-0

                        bg-zinc-950

                        border

                        border-zinc-800

                        rounded-lg

                        shadow-2xl

                        overflow-hidden

                        z-50

                        max-h-80

                        overflow-y-auto

                    "

                >

                    {

                        !loading && results.length === 0 &&

                        <div className="px-4 py-6 text-center text-sm text-zinc-500">

                            Sin resultados para "{query}"

                        </div>

                    }

                    {

                        results.map((result, index) => {

                            const Icon = getTypeIcon(result.item.item_type);

                            const matchLabel =

                                MATCHED_FIELD_LABEL[result.matched_field] ||

                                result.matched_field;

                            return (

                                <button

                                    key={`${result.item.id}-${index}`}

                                    onClick={() => handleSelect(result)}

                                    className="

                                        w-full

                                        flex

                                        items-center

                                        gap-3

                                        px-3

                                        py-2.5

                                        text-left

                                        hover:bg-zinc-900

                                        transition-colors

                                        border-b

                                        border-zinc-900

                                        last:border-b-0

                                    "

                                >

                                    <div

                                        className="

                                            w-8

                                            h-8

                                            rounded-lg

                                            bg-zinc-900

                                            border

                                            border-zinc-800

                                            flex

                                            items-center

                                            justify-center

                                            shrink-0

                                            text-zinc-500

                                        "

                                    >

                                        <Icon size={14} />

                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <div className="text-sm text-white truncate">

                                            {result.item.title}

                                        </div>

                                        <div className="text-xs text-zinc-500 truncate">

                                            {getTypeLabel(result.item.item_type)}

                                            {

                                                result.matched_field !== "title" &&

                                                ` · coincide en ${matchLabel}`

                                            }

                                        </div>

                                    </div>

                                </button>

                            );

                        })

                    }

                </div>

            }

        </div>

    );

}