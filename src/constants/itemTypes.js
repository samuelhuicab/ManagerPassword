import {
    Server,
    Database,
    Mail,
    Globe,
    KeyRound,
    FileText,
} from "lucide-react";

export const TYPE_ICON = {

    Server: Server,
    Database: Database,
    Email: Mail,
    Website: Globe,
    Api: KeyRound,
    License: KeyRound,
    Note: FileText,

};

export const TYPE_LABEL = {

    Server: "Servidor",
    Database: "Base de datos",
    Email: "Correo",
    Website: "Sitio web",
    Api: "API",
    License: "Licencia",
    Note: "Nota",

};

export const ITEM_TYPES = Object.keys(TYPE_LABEL);

export function getTypeIcon(type) {

    return TYPE_ICON[type] || FileText;

}

export function getTypeLabel(type) {

    return TYPE_LABEL[type] || type;

}