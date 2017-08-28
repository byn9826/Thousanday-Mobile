export const apiUrl = "https://thousanday.com";

export function getGender( value ) {
    value = parseInt( value );
    if ( value === 0 ) {
        return "♂";
    } else {
        return "♀";
    }
}

export function getType( value ) {
    value = parseInt( value );
    switch ( value ) {
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

export function getNature( value ) {
    value = parseInt( value );
    switch ( value ) {
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