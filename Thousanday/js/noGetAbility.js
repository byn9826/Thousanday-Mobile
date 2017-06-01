export default function noGetAbility(value) {
    value = parseInt(value);
    switch (value) {
        case 0:
            return "Attack";
            break;
        case 1:
            return "Defend";
            break;
        case 2:
            return "Health";
            break;
        case 3:
            return "Swift";
            break;
        case 4:
            return "Lucky";
            break;
    }
}