import { apiUrl } from "./Params.js";

export default function processGallery( data ) {
    let images = [];
    data.forEach( d => {
        images.push(
            {
                key: apiUrl + "/img/pet/" + d.pet_id + "/moment/" + d.image_name,
                id: d.moment_id
            }
        );
    });
    return images;
}
