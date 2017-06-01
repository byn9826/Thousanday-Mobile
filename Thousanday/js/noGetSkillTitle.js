export default function noGetSkillTitle(value) {
    value = parseInt(value);
    switch (value) {
        case 0:
            return "1st";
            break;
        case 1:
            return "2nd";
            break;
        case 2:
            return "3rd";
            break;
        case 3:
            return "4th";
            break;
    }
}