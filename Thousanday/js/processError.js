export default function processError(err) {
    switch(err.status) {
        case 404:
            alert("Item doesn't exist!");
            break;
        case 500:
            alert("Something Wrong, please try later!");
            break;
        case 403:
            alert("Status expired, please login again!");
            break;
    }
}
