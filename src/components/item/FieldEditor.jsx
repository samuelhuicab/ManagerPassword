import { useState } from "react";
import {
    Eye,
    EyeOff,
    Copy,
    Check
} from "lucide-react";

import useVault from "../../hooks/useVault";

import {
    updateItemField
} from "../../services/vault";

export default function FieldEditor({

    field,

}) {

    const {

        selectedItem,
        setSelectedItem,

    } = useVault();

    const [show,setShow]=useState(false);

    const [copied,setCopied]=useState(false);

    async function changeValue(value){

        const updatedFields=selectedItem.fields.map(f=>{

            if(f.id===field.id){

                return{

                    ...f,

                    value

                };

            }

            return f;

        });

        setSelectedItem({

            ...selectedItem,

            fields:updatedFields,

        });

        await updateItemField(

            selectedItem.id,

            field.key,

            value,

        );

    }

    async function copy(){

        await navigator.clipboard.writeText(field.value);

        setCopied(true);

        setTimeout(()=>{

            setCopied(false);

        },1500);

    }

    return(

        <div className="mb-6">

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

                    bg-zinc-900

                    border

                    border-zinc-800

                    rounded-lg

                    overflow-hidden

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

                    onChange={(e)=>changeValue(e.target.value)}

                    className="

                        flex-1

                        bg-transparent

                        px-4

                        py-3

                        text-white

                        outline-none

                    "

                />

                {

                    field.hidden&&

                    <button

                        onClick={()=>setShow(!show)}

                        className="

                            px-3

                            hover:bg-zinc-800

                            h-full

                        "

                    >

                        {

                            show

                            ?

                                <EyeOff size={18} className="text-zinc-400"/>

                            :

                                <Eye size={18} className="text-zinc-400"/>

                        }

                    </button>

                }

                <button

                    onClick={copy}

                    className="

                        px-3

                        hover:bg-zinc-800

                        h-full

                    "

                >

                    {

                        copied

                        ?

                            <Check size={18} className="text-zinc-400"/>

                        :

                            <Copy size={18} className="text-zinc-400"/>

                    }

                </button>

            </div>

        </div>

    );

}