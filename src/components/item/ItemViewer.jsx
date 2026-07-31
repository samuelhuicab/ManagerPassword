import {

    Eye,
    EyeOff,

} from "lucide-react";

import { useState } from "react";

export default function ItemViewer({

    item,

}) {

    const [show,setShow]=useState({});

    if(!item){

        return(

            <div

                className="

                    flex-1

                    flex

                    items-center

                    justify-center

                    bg-zinc-950

                    text-zinc-500

                "

            >

                Selecciona un elemento

            </div>

        );

    }

    return(

        <div

            className="

                flex-1

                overflow-auto

            "

        >

            <div

                className="

                    p-6

                    border-b

                    border-zinc-800

                "

            >

                <h1

                    className="

                        text-2xl

                        text-white

                        font-semibold

                    "

                >

                    {item.title}

                </h1>

            </div>

            <div className="p-6 space-y-6">

                {

                    item.fields.map(field=>(

                        <div key={field.id}>

                            <div

                                className="

                                    text-xs

                                    text-zinc-500

                                    mb-2

                                "

                            >

                                {field.label}

                            </div>

                            <div

                                className="

                                    bg-zinc-900

                                    rounded-lg

                                    border

                                    border-zinc-800

                                    p-3

                                    flex

                                    justify-between

                                    items-center

                                "

                            >

                                <span

                                    className="

                                        text-white

                                        break-all

                                    "

                                >

                                    {

                                        field.hidden

                                        ?

                                            show[field.id]

                                                ?

                                                field.value

                                                :

                                                "••••••••••••"

                                        :

                                            field.value

                                    }

                                </span>

                                {

                                    field.hidden &&

                                    <button

                                        onClick={()=>{

                                            setShow({

                                                ...show,

                                                [field.id]:!show[field.id]

                                            })

                                        }}

                                    >

                                        {

                                            show[field.id]

                                            ?

                                                <EyeOff size={18}/>

                                            :

                                                <Eye size={18}/>

                                        }

                                    </button>

                                }

                            </div>

                        </div>

                    ))

                }

                <div>

                    <div

                        className="

                            text-xs

                            text-zinc-500

                            mb-2

                        "

                    >

                        Notas

                    </div>

                    <div

                        className="

                            bg-zinc-900

                            border

                            border-zinc-800

                            rounded-lg

                            p-4

                            text-white

                            whitespace-pre-wrap

                        "

                    >

                        {item.notes || "Sin notas"}

                    </div>

                </div>

            </div>

        </div>

    );

}