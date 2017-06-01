export default function noGetGender(value) {
    value = parseInt(value);
    if (value === 0) {
        return "♂";
    } else {
        return "♀";
    }
}