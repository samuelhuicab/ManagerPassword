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
                bg-black/60
                flex
                items-center
                justify-center
                z-50
            "

        >

            <div

                onClick={(e) => e.stopPropagation()}

                className="
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-xl
                    w-full
                    max-w-md
                    p-6
                "

            >

                <h2 className="text-lg font-semibold text-white mb-4">

                    {title}

                </h2>

                {children}

            </div>

        </div>

    );

}