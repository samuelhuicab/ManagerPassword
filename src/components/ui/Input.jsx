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
                    bg-zinc-900
                    border
                    border-zinc-800
                    rounded-lg
                    px-4
                    py-3
                    text-white
                    outline-none
                    focus:border-blue-500
                "

            />

        </div>

    );

}