import { resourceUrl } from './Params';

export default function processGallery(data) {
  const images = [];
  data.forEach((d) => {
    images.push({
      key: `${resourceUrl}/public/pet/${d.pet_id}/moment/${d.image_name}`,
      id: d.moment_id
    });
  });
  return images;
}
