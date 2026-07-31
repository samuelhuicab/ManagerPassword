export default function Button({

    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
    className = "",

}) {

    const base = `
        h-10
        px-4
        rounded-lg
        text-sm
        font-medium
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
    `;

    const variants = {

        primary: `
            bg-blue-600
            hover:bg-blue-500
            text-white
        `,

        secondary: `
            bg-zinc-800
            hover:bg-zinc-700
            text-zinc-200
        `,

        danger: `
            bg-red-600
            hover:bg-red-500
            text-white
        `,

    };

    return (

        <button

            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${className}`}

        >

            {children}

        </button>

    );

}