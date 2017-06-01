export default function noGetType(value) {
    value = parseInt(value);
    switch (value) {
        case 0:
            return "dog";
            break;
        case 1:
            return "cat";
            break;
        case 2:
            return "bird";
            break;
        case 3:
            return "fish";
            break;
        case 4:
            return "other";
            break;
    }
}