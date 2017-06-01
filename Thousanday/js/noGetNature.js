export default function noGetNature(value) {
    value = parseInt(value);
    switch (value) {
        case 0:
            return "cute";
            break;
        case 1:
            return "strong";
            break;
        case 2:
            return "smart";
        case 3:
            return "beauty";
    }
}