import { Search } from "lucide-react";

export default function Header() {

    return (

        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-5">

            <h1 className="text-white font-semibold text-lg">

                Password Manager

            </h1>

            <div className="relative w-80">

                <Search
                    size={18}
                    className="absolute left-3 top-3 text-zinc-500"
                />

                <input

                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-blue-500"

                    placeholder="Buscar..."

                />

            </div>

        </header>

    );

}