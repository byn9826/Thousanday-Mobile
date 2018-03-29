export const apiUrl = 'http://resource.smilings.me/api';
export const resourceUrl = 'http://resource.smilings.me';

export function getGender(value) {
  return parseInt(value, 10) === 0 ? '♂' : '♀';
}

export function getType(value) {
  switch (parseInt(value, 10)) {
    case 0:
      return 'dog';
    case 1:
      return 'cat';
    case 2:
      return 'bird';
    case 3:
      return 'fish';
    case 4:
      return 'other';
    default:
      return false;
  }
}

export function getNature(value) {
  switch (parseInt(value, 10)) {
    case 0:
      return 'cute';
    case 1:
      return 'strong';
    case 2:
      return 'smart';
    case 3:
      return 'beauty';
    default:
      return false;
  }
}
