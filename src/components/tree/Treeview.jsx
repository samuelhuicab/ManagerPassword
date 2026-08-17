import TreeNode from "./TreeNode";
import useVault from "../../hooks/useVault";

export default function TreeView() {

    const {
        nodes,
        loading,
    } = useVault();

    if (loading) {
        return (
            <div className="p-4 text-zinc-500">
                Cargando...
            </div>
        );
    }

    const roots = nodes.filter(node => node.parent_id === null);

    if (roots.length === 0) {
        return (
            <div className="p-4 text-zinc-500">
                No existen carpetas.
            </div>
        );
    }

    return (
        <div>

            {
                roots.map(node => (

                    <TreeNode
                        key={node.id}
                        node={node}
                        level={0}
                    />

                ))
            }

        </div>
    );

}