export default function Input({

    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
    autoFocus = false,

}) {

    return (

        <div className="mb-4">

            {

                label &&

                <label className="block text-sm text-zinc-400 mb-2">

                    {label}

                </label>

            }

            <input

                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoFocus={autoFocus}

                className="
                    w-full
                    h-11
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-lg
                    px-4
                    text-sm
                    text-white
                    outline-none
                    transition-colors
                    placeholder:text-zinc-600
                    focus:border-blue-500
                "

            />

        </div>

    );

}