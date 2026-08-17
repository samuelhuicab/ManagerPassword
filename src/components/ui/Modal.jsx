export default function Modal({

    title,
    onClose,
    children,

}) {

    return (

        <div

            onClick={onClose}

            className="
                fixed
                inset-0
                bg-black/70
                backdrop-blur-sm
                flex
                items-center
                justify-center
                z-50
                p-4
            "

        >

            <div

                onClick={(e) => e.stopPropagation()}

                className="
                    bg-zinc-950
                    border
                    border-zinc-800
                    rounded-xl
                    w-full
                    max-w-md
                    shadow-2xl
                "

            >

                <div

                    className="
                        px-6
                        py-4
                        border-b
                        border-zinc-800
                    "

                >

                    <h2 className="text-base font-semibold text-white">

                        {title}

                    </h2>

                </div>

                <div className="p-6">

                    {children}

                </div>

            </div>

        </div>

    );

}