import { useState } from "react";
import {
    Eye,
    EyeOff,
    Copy,
    Check
} from "lucide-react";

export default function FieldEditor({

    field,
    onChange,

}) {

    const [show, setShow] = useState(false);

    const [copied, setCopied] = useState(false);

    async function copy() {

        await navigator.clipboard.writeText(field.value);

        setCopied(true);

        setTimeout(() => {

            setCopied(false);

        }, 1500);

    }

    return (

        <div className="mb-5">

            <label

                className="

                    block

                    text-sm

                    text-zinc-400

                    mb-2

                "

            >

                {field.label}

            </label>

            <div

                className="

                    flex

                    items-center

                    h-11

                    bg-zinc-900

                    border

                    border-zinc-800

                    rounded-lg

                    overflow-hidden

                    transition-colors

                    focus-within:border-blue-500

                "

            >

                <input

                    type={

                        field.hidden

                        ?

                            show

                                ?

                                    "text"

                                :

                                    "password"

                        :

                            "text"

                    }

                    value={field.value}

                    onChange={(e) => onChange(e.target.value)}

                    className="

                        flex-1

                        h-full

                        bg-transparent

                        px-4

                        text-sm

                        text-white

                        outline-none

                    "

                />

                {

                    field.hidden &&

                    <button

                        onClick={() => setShow(!show)}

                        title={show ? "Ocultar" : "Mostrar"}

                        className="

                            px-3

                            h-full

                            text-zinc-500

                            hover:text-white

                            hover:bg-zinc-800

                            transition-colors

                        "

                    >

                        {

                            show

                            ?

                                <EyeOff size={16}/>

                            :

                                <Eye size={16}/>

                        }

                    </button>

                }

                <button

                    onClick={copy}

                    title="Copiar"

                    className="

                        px-3

                        h-full

                        text-zinc-500

                        hover:text-white

                        hover:bg-zinc-800

                        transition-colors

                    "

                >

                    {

                        copied

                        ?

                            <Check size={16} className="text-emerald-500"/>

                        :

                            <Copy size={16}/>

                    }

                </button>

            </div>

        </div>

    );

}